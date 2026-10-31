import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { signIn } from '../src/drm/api'

export default function Connexion() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true)
    setError('')
    try {
      await signIn(username.trim(), password)
      router.replace('/(tabs)/library')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Connexion</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="username"
          onChangeText={setUsername}
          placeholder="Nom d’utilisateur"
          style={styles.input}
          value={username}
        />
        <TextInput
          autoComplete="password"
          onChangeText={setPassword}
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <Pressable disabled={busy} onPress={submit} style={styles.button}>
          <Text style={styles.buttonText}>{busy ? 'Connexion…' : 'Se connecter'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff', padding: 24 },
  form: { gap: 14 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#111827' },
  input: { borderColor: '#d1d5db', borderWidth: 1, borderRadius: 10, padding: 14, color: '#111827' },
  button: { backgroundColor: '#1e40af', borderRadius: 10, padding: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#b91c1c' },
})
