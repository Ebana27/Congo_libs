import { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { AppHeader } from '../src/components/Header'
import { AuthenticationRequiredError } from '../src/drm/api'
import {
  listOfflineDownloads,
  removeOfflineDownload,
  renewOfflineLicense,
} from '../src/drm/storage'

export default function Downloads() {
  const router = useRouter()
  const [downloads, setDownloads] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const refresh = useCallback(async () => {
    try {
      setDownloads(await listOfflineDownloads())
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [])

  useFocusEffect(useCallback(() => {
    refresh()
  }, [refresh]))

  const renew = async (documentId) => {
    setBusyId(documentId)
    setError('')
    try {
      await renewOfflineLicense(documentId)
      await refresh()
    } catch (requestError) {
      if (requestError instanceof AuthenticationRequiredError) {
        router.replace('/connexion')
      } else {
        setError(requestError.message)
      }
    } finally {
      setBusyId('')
    }
  }

  const remove = async (documentId) => {
    try {
      await removeOfflineDownload(documentId)
      await refresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="TÉLÉCHARGEMENTS" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Lecture hors ligne</Text>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {!downloads.length && !error && (
          <Text style={styles.empty}>Aucun document chiffré disponible hors ligne.</Text>
        )}
        {downloads.map((record) => (
          <View key={record.document_id} style={styles.card}>
            <Text style={styles.documentTitle}>{record.title}</Text>
            <Text style={styles.expiry}>
              Expire le {new Date(record.expires_at).toLocaleString()}
            </Text>
            <View style={styles.actions}>
              <Pressable
                onPress={() => router.push(`/reader/${record.document_id}?offline=1`)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Lire</Text>
              </Pressable>
              <Pressable
                disabled={Boolean(busyId)}
                onPress={() => renew(record.document_id)}
                style={[styles.button, styles.renewButton, Boolean(busyId) && styles.disabled]}
              >
                <Text style={styles.buttonText}>
                  {busyId === record.document_id ? 'Renouvellement…' : 'Renouveler'}
                </Text>
              </Pressable>
              <Pressable onPress={() => remove(record.document_id)} style={styles.removeButton}>
                <Text style={styles.removeText}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 18, paddingBottom: 36, gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  card: { padding: 16, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, gap: 8 },
  documentTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  expiry: { color: '#6b7280', fontSize: 13 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  button: { padding: 10, backgroundColor: '#1e40af', borderRadius: 8 },
  renewButton: { backgroundColor: '#166534' },
  buttonText: { color: '#fff', fontWeight: '700' },
  removeButton: { padding: 10 },
  removeText: { color: '#b91c1c', fontWeight: '700' },
  disabled: { opacity: 0.45 },
  error: { color: '#b91c1c' },
  empty: { color: '#6b7280', marginTop: 20 },
})
