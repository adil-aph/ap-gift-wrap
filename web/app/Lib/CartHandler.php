<?php

declare(strict_types=1);

namespace App\Lib;

use Shopify\Auth\Session;
use Shopify\Clients\Graphql;

class CartHandler
{
    private const CREATE_PRODUCTS_MUTATION = <<<'QUERY'
    mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
            product {
                id
                variants(first: 1)
                {
                    edges {
                        node {
                            id
                            legacyResourceId 
                        }
                    }
                }
            }
        }
    }
    QUERY;

    
}
