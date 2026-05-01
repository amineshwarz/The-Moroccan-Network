<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SecurityApiTest extends WebTestCase
{
    public function testAdminRouteIsProtected(): void
    {
        // On simule un navigateur
        $client = static::createClient();
        
        // On tente d'aller sur la liste des membres sans être connecté
        $client->request('GET', '/api/admin/users');

        // On affirme (assert) que Symfony doit nous bloquer (Erreur 401)
        $this->assertResponseStatusCodeSame(401);
    }
    
}