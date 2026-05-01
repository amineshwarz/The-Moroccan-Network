<?php

namespace App\Tests\Unit;

use App\Entity\Subscriber;
use PHPUnit\Framework\TestCase;

class SubscriberTest extends TestCase
{
    public function testSubscriberInitialState(): void
    {
        // 1. Préparation
        $subscriber = new Subscriber();
        $subscriber->setFirstName('Amine');
        $subscriber->setAmount(3500);

        // 2. Action (Act) On simule ce que fait le contrôleur de paiement
        $subscriber->setStatus('PENDING');
        
       // 3. Vérification (Assert)
       $this->assertEquals('PENDING', $subscriber->getStatus());
       $this->assertEquals('Amine', $subscriber->getFirstName());
    }
}