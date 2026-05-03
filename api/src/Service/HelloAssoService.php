<?php
namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class HelloAssoService
{
    public function __construct(
        private HttpClientInterface $client,
        private string $clientId,
        private string $clientSecret,
        private string $orgSlug,
        private CacheInterface $cache
    ) {}
// MÉTHODE 1 : getAccessToken() Obtient un token OAuth2 HelloAsso (avec mise en cache 30 min)
    public function getAccessToken(): string
    {
        return $this->cache->get('helloasso_token', function (ItemInterface $item) {
            $item->expiresAfter(1800); // 30 min

            // --- Appel OAuth2 "Client Credentials" à HelloAsso ---
            $response = $this->client->request('POST', 'https://api.helloasso-sandbox.com/oauth2/token', [
                'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
                'body' => [
                    'grant_type' => 'client_credentials',
                    'client_id' => $this->clientId,
                    'client_secret' => $this->clientSecret,
                ],
            ]);

            return $response->toArray()['access_token'];
        });
    }

// MÉTHODE 2 : createCheckoutIntent() Crée une session de paiement HelloAsso et retourne l'URL
    public function createCheckoutIntent(array $data): array
    {
        try {
            // ÉTAPE 1 — Récupérer le token (depuis le cache ou via OAuth)
            $token = $this->getAccessToken();  

            // ÉTAPE 2 — Créer le checkout via l'API HelloAsso
            $response = $this->client->request('POST', "https://api.helloasso-sandbox.com/v5/organizations/{$this->orgSlug}/checkout-intents", [
                'auth_bearer' => $token,
                'json' => $data,
            ]);

            //  ÉTAPE 3 — Lire la réponse sans lever d'exception automatiquetoArray 
            // (false) permet de ne pas lancer d'exception 500 si l'API répond une erreur
            // cela nous permet de lire le message d'erreur renvoyé par HelloAsso
            $result = $response->toArray(false); 

            // ÉTAPE 4 — Vérifier manuellement le statut HTTP
            if ($response->getStatusCode() !== 200 && $response->getStatusCode() !== 201) {
                // Ici, on récupère le message d'erreur précis de HelloAsso
                throw new \Exception("Erreur HelloAsso : " . json_encode($result));
            }

            return $result;
        } catch (\Exception $e) {
            throw new \Exception("Erreur lors de l'appel API : " . $e->getMessage());
        }
    }
}








// HelloAsso utilise OAuth2 "Client Credentials" pour sécuriser son API.
// Chaque appel API nécessite un token d'accès temporaire (valide 30 min).
// Ce service centralise :
//   1. La récupération + mise en cache du token OAuth2
//   2. La création d'un checkout (session de paiement HelloAsso)
// Sans ce service, PaymentController devrait refaire l'auth à chaque paiement.