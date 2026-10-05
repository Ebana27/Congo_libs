# Ressource API « Pleurer rire »

L'identifiant fourni pour la ressource est conservé dans `src/services/api.js` :

`1W3dJ80LWlprS_-KiLUI3hjn5ZvT-GiFT`

L'identifiant seul ne contient pas le chemin HTTP de l'endpoint REST. Il ne faut donc pas l'utiliser comme URL API inventée. Dès que l'URL complète de l'endpoint est fournie, elle pourra être branchée dans `VITE_PLEURER_RIRE_API_URL` et appelée depuis `getPleurerRire()`.
