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

    public function getAccessToken(): string
    {
        return $this->cache->get('helloasso_token', function (ItemInterface $item) {
            $item->expiresAfter(1800); // 30 min

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


    public function createCheckoutIntent(array $data): array
    {
        try {
            $token = $this->getAccessToken();  
            
            $response = $this->client->request('POST', "https://api.helloasso-sandbox.com/v5/organizations/{$this->orgSlug}/checkout-intents", [
                'auth_bearer' => $token,
                'json' => $data,
            ]);

            // toArray(false) permet de ne pas lancer d'exception 500 si l'API répond une erreur
            // cela nous permet de lire le message d'erreur renvoyé par HelloAsso
            $result = $response->toArray(false); 

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