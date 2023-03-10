<?php

use App\Lib\EnsureBilling;

return [

    /*
    |--------------------------------------------------------------------------
    | Shopify billing
    |--------------------------------------------------------------------------
    |
    | You may want to charge merchants for using your app. Setting required to true will cause the EnsureShopifySession
    | middleware to also ensure that the session is for a merchant that has an active one-time payment or subscription.
    | If no payment is found, it starts off the process and sends the merchant to a confirmation URL so that they can
    | approve the purchase.
    |
    | Learn more about billing in our documentation: https://shopify.dev/apps/billing
    |
    */
    "billing" => [
        "required" => false,

        // Example set of values to create a charge for $5 one time
        "chargeName" => "Giftify Pro - Gift Wrap, Custom Message Monthly Billing",
        "amount" => 9.99,
        "currencyCode" => "USD", // Currently only supports USD
        "interval" => EnsureBilling::INTERVAL_EVERY_30_DAYS,
        'test' => true,
        'plan_id' => 1
    ],
    "billing_yearly" => [
        "required" => false,

        // Example set of values to create a charge for $5 one time
        "chargeName" => "Giftify Pro - Gift Wrap, Custom Message Yearly Billing",
        "amount" => 99.99,
        "currencyCode" => "USD", // Currently only supports USD
        "interval" => EnsureBilling::INTERVAL_ANNUAL,
        'test' => true,
        'plan_id' => 2
    ],

];
