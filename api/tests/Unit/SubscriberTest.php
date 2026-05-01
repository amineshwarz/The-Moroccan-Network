<?php

namespace App\Tests\Unit;

use App\Entity\Subscriber;
use PHPUnit\Framework\TestCase;

class SubscriberTest extends TestCase
{
    public function testSubscriberInitialState(): void
    {
        $subscriber = new Subscriber();
        $subscriber->setFirstName('Amine');
        $subscriber->setAmount(3500);

        // On vérifie que les données sont bien assignées
        $this->assertEquals('Amine', $subscriber->getFirstName());
        $this->assertEquals(3500, $subscriber->getAmount());
        
        // On vérifie que l'ID est bien null avant l'enregistrement en base
        $this->assertNull($subscriber->getId());
    }
}