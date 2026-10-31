import { useEffect, useState } from 'react'
import { ActivityIndicator, AppState, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Pdf from 'react-native-pdf'
import * as ScreenCapture from 'expo-screen-capture'
import { usePreventScreenCapture } from 'expo-screen-capture'

import {
  AuthenticationRequiredError,
  fetchPageImage,
  fetchReaderMetadata,
} from '../../src/drm/api'
import {
  prepareOfflinePdf,
  removeTemporaryReaderFiles,
  reportScreenCapture,
} from '../../src/drm/storage'

export default function MobileReader() {
  const { id, offline } = useLocalSearchParams()
  const router = useRouter()
  const isOffline = offline === '1'
  const [metadata, setMetadata] = useState(null)
  const [page, setPage] = useState(1)
  const [images, setImages] = useState({})
  const [pdfUri, setPdfUri] = useState('')
  const [licenseRecord, setLicenseRecord] = useState(null)
  const [appActive, setAppActive] = useState(true)
  const [error, setError] = useState('')

  usePreventScreenCapture('document-reader')

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      setAppActive(state === 'active')
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'ios') return undefined
    ScreenCapture.enableAppSwitcherProtectionAsync(0.9).catch(() => {
      setError('La protection de l’aperçu iOS n’a pas pu être activée.')
    })
    return () => {
      ScreenCapture.disableAppSwitcherProtectionAsync().catch(() => {
        console.error('Échec de la désactivation de la protection de l’aperçu iOS.')
      })
    }
  }, [])

  useEffect(() => {
    let active = true
    setError('')
    if (isOffline) {
      prepareOfflinePdf(id)
        .then(({ fileUri, record }) => {
          if (!active) {
            removeTemporaryReaderFiles().catch((cleanupError) => {
              console.error('Échec de la suppression du PDF temporaire.', cleanupError)
            })
            return
          }
          setPdfUri(fileUri)
          setMetadata({ title: record.title })
          setLicenseRecord(record)
        })
        .catch((requestError) => {
          if (!active) return
          if (requestError instanceof AuthenticationRequiredError) {
            router.replace('/connexion')
          } else {
            setError(requestError.message)
          }
        })
    } else {
      fetchReaderMetadata(id)
        .then((data) => {
          if (active) {
            setMetadata(data)
            setPage(1)
          }
        })
        .catch((requestError) => {
          if (!active) return
          if (requestError instanceof AuthenticationRequiredError) {
            router.replace('/connexion')
          } else {
            setError(requestError.message)
          }
        })
    }
    return () => {
      active = false
      if (isOffline) {
        removeTemporaryReaderFiles().catch((requestError) => {
          console.error('Échec de la suppression du PDF temporaire.', requestError)
        })
      }
    }
  }, [id, isOffline])

  useEffect(() => {
    if (isOffline || !metadata?.reading_session) return undefined
    let active = true
    setImages({})
    Promise.all([page, page + 1]
      .filter((number) => number <= metadata.pages)
      .map(async (number) => [number, await fetchPageImage(id, number, metadata.reading_session)]))
      .then((entries) => {
        if (active) setImages(Object.fromEntries(entries))
      })
      .catch((requestError) => {
        if (!active) return
        if (requestError instanceof AuthenticationRequiredError) {
          router.replace('/connexion')
        } else {
          setError(requestError.message)
        }
      })
    return () => { active = false }
  }, [id, isOffline, metadata, page])

  useEffect(() => {
    if (!licenseRecord) return undefined
    const subscription = ScreenCapture.addScreenshotListener(() => {
      reportScreenCapture(id, licenseRecord).catch((requestError) => {
        setError(requestError.message)
      })
    })
    return () => subscription.remove()
  }, [id, licenseRecord])

  const closeReader = () => router.back()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={closeReader} style={styles.back}>
          <Text style={styles.backText}>Retour</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>{metadata?.title || 'Lecture protégée'}</Text>
      </View>
      {!appActive ? (
        <View style={styles.mask}>
          <Text style={styles.maskText}>Contenu masqué</Text>
        </View>
      ) : error ? (
        <View style={styles.message}>
          <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
          <Pressable
            onPress={() => (error.includes('expiré') ? router.replace('/connexion') : closeReader())}
            style={styles.action}
          >
            <Text style={styles.actionText}>
              {error.includes('expiré') ? 'Se connecter' : 'Fermer'}
            </Text>
          </Pressable>
        </View>
      ) : isOffline && pdfUri ? (
        <Pdf
          enablePaging
          onPageChanged={(nextPage) => setPage(nextPage)}
          onError={() => setError('Impossible de déchiffrer ou d’afficher le document.')}
          source={{ uri: pdfUri }}
          style={styles.pdf}
        />
      ) : !isOffline && metadata ? (
        <View style={styles.onlineViewer}>
          {images[page]
            ? <View accessible><Text style={styles.pageIndicator}>Page {page} sur {metadata.pages}</Text></View>
            : <ActivityIndicator size="large" />}
          {images[page] ? <ImagePage uri={images[page]} page={page} /> : null}
          <View style={styles.navigation}>
            <Pressable disabled={page <= 1} onPress={() => setPage(page - 1)} style={styles.action}>
              <Text style={styles.actionText}>Précédente</Text>
            </Pressable>
            <Pressable disabled={page >= metadata.pages} onPress={() => setPage(page + 1)} style={styles.action}>
              <Text style={styles.actionText}>Suivante</Text>
            </Pressable>
          </View>
          {images[page + 1] ? <View style={styles.prefetch}><ImagePage uri={images[page + 1]} page={page + 1} /></View> : null}
        </View>
      ) : (
        <ActivityIndicator size="large" style={styles.loading} />
      )}
    </SafeAreaView>
  )
}

function ImagePage({ uri, page }) {
  return <Image accessibilityLabel={`Page ${page}`} resizeMode="contain" source={{ uri }} style={styles.pageImage} />
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12 },
  back: { padding: 10 },
  backText: { color: '#fff', fontWeight: '700' },
  title: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '700' },
  pdf: { flex: 1, backgroundColor: '#374151' },
  onlineViewer: { flex: 1, alignItems: 'stretch', padding: 10 },
  pageImage: { flex: 1, width: '100%' },
  pageIndicator: { color: '#fff', textAlign: 'center', paddingVertical: 8 },
  navigation: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { padding: 12, backgroundColor: '#1e40af', borderRadius: 8 },
  actionText: { color: '#fff', fontWeight: '700' },
  prefetch: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  loading: { flex: 1 },
  message: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  error: { color: '#fecaca', textAlign: 'center' },
  mask: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' },
  maskText: { color: '#fff', fontSize: 18 },
})
