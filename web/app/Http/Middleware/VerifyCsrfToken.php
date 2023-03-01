<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'api/graphql',
        'api/webhooks',
        'api/gift/test',
        'api/gift/create',
        'api/gift/update',
        'api/gift/image',
        'api/gift/clicks',
        'api/gift/addcart',
        'api/billing/charge'
    ];
}
