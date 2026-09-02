export async function readApiResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    throw new Error(
      response.status >= 500
        ? 'Le serveur rencontre un problème. Réessayez dans quelques instants.'
        : 'Réponse inattendue du serveur. Vérifiez la configuration de l’API.'
    )
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || 'La demande n’a pas pu être traitée.')
  }

  return data
}

export function getApiErrorMessage(error) {
  if (error instanceof TypeError) {
    return 'Impossible de joindre le serveur. Vérifiez que l’API est démarrée.'
  }

  return error instanceof Error
    ? error.message
    : 'Une erreur inattendue est survenue. Réessayez.'
}
