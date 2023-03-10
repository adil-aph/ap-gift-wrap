<?php

declare(strict_types=1);

namespace App\Lib;

use App\Exceptions\ShopifyProductCreatorException;
use Shopify\Auth\Session;
use Shopify\Clients\Graphql;

class ProductCreator
{
    private const CREATE_PRODUCTS_MUTATION = <<<'QUERY'
    mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
            product {
                id
                handle
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

    private const UPDATE_PRODUCTS_MUTATION = <<<'QUERY'
    mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
            product {
                id
                handle
                variants(first: 1)
                {
                    edges {
                        node {
                            id
                            legacyResourceId 
                        }
                    }
                }
                images(first: 1) {
                    edges {
                        node {
                            url
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }
    QUERY;   

    public static function call(Session $session, int $count)
    {
        
        $client = new Graphql($session->getShop(), $session->getAccessToken());

        for ($i = 0; $i < $count; $i++) {
            $response = $client->query(
                [
                    "query" => self::CREATE_PRODUCTS_MUTATION,
                    "variables" => [
                        "input" => [
                            "title" => self::randomTitle(),
                            "variants" => [["price" => self::randomPrice()]],
                        ]
                    ]
                ],
            );

            if ($response->getStatusCode() !== 200) {
                throw new ShopifyProductCreatorException($response->getBody()->__toString(), $response);
            }
        }
    }

    public function createGiftProduct(Session $session, string $title, $price, string $desc, string $imagePath)
    {
        $client = new Graphql($session->getShop(), $session->getAccessToken());

            $response = $client->query(
                [
                    "query" => self::CREATE_PRODUCTS_MUTATION,
                    "variables" => [
                        "input" => [
                            "title" => $title,
                            "descriptionHtml" => $desc,
                            "images" => [["altText" => $title, "src" => $imagePath]],
                            "variants" => [
                                [
                                    "price" => $price,
                                    "inventoryItem" => ["tracked" => false],
                                    "sku" => "gp-gw-aph"
                                ]
                            ],
                        ]
                    ]
                ],
            );

            if ($response->getStatusCode() !== 200) {
               
                throw new ShopifyProductCreatorException($response->getBody()->__toString(), $response);
            }

            return $response->getBody()->__toString();
    }

    public function updateGiftProduct(Session $session, string $gid, string $title, $price, string $desc, string $imagePath)
    {
        $client = new Graphql($session->getShop(), $session->getAccessToken());

            $response = $client->query(
                [
                    "query" => self::UPDATE_PRODUCTS_MUTATION,
                    "variables" => [
                        "input" => [
                            "id" => $gid,
                            "title" => $title,
                            "descriptionHtml" => $desc,
                            "images" => [["altText" => $title, "src" => $imagePath]],
                            "variants" => [
                                [
                                    "price" => $price,
                                    "inventoryItem" => ["tracked" => false],
                                    "sku" => "gp-gw-aph"
                                ]
                            ],
                        ]
                    ]
                ],
            );

            if ($response->getStatusCode() !== 200) {
               
                throw new ShopifyProductCreatorException($response->getBody()->__toString(), $response);
            }

            return $response->getBody()->__toString();
    }

    public function getGiftProduct(Session $session, string $gid)
    {

        $client = new Graphql($session->getShop(), $session->getAccessToken());

        $query = <<<QUERY
        query {
            product(id: "$gid") {
            title
            description
            variants(first: 1)
            {
                edges {
                    node {
                        id
                        legacyResourceId   
                        price 
                    }
                  }
            }
            onlineStoreUrl
            featuredImage
            {
             url
            }
            }
        }
        QUERY;
            $response = $client->query(
                [
                    "query" => $query,
                ]
            );

            if ($response->getStatusCode() !== 200) {
               
                throw new ShopifyProductCreatorException($response->getBody()->__toString(), $response);
            }

            return $response->getBody()->__toString();
    }

    public static function getOrders(Session $session)
    {

        $client = new Graphql($session->getShop(), $session->getAccessToken());
        $query = <<<'QUERY'
                    query {
                        orders(first: 250, query: "sku:gp-gw-aph") {
                            edges {
                                node {
                                    id
                                    totalPriceSet {
                                        shopMoney {
                                            amount
                                            currencyCode
                                        }
                                    }
                                }
                            }
                        }
                    }
                QUERY;
                
        $response = $client->query(
            [
                "query" => $query,
            ]
        );
                
        return json_decode($response->getBody()->__toString());
    }

    public static function getOrdersByDate(Session $session, $startDate, $endDate)
    {

        $client = new Graphql($session->getShop(), $session->getAccessToken());
        $query = <<<QUERY
                    query {
                        orders(first: 250, query: "sku:gp-gw-aph AND created_at:>=$startDate created_at:<=$endDate") {
                            edges {
                                node {
                                    id
                                    createdAt
                                    totalPriceSet {
                                        shopMoney {
                                            amount
                                            currencyCode
                                        }
                                    }
                                }
                            }
                        }
                    }
                QUERY;
                
        $response = $client->query(
            [
                "query" => $query,
            ]
        );
                
        return json_decode($response->getBody()->__toString());
    }

    public function setScriptTag(Session $session)
    {

        $client = new Graphql($session->getShop(), $session->getAccessToken());

       /* $query = <<<'QUERY'
            query {
                scriptTags(first: 50, src: "https://wearelegion.xyz/js/email-widget.js") {
                edges {
                    node {
                        id
                        src
                    }
                }
                }
            }
            QUERY;

            $response = $client->query(["query" => $query]);
            
            $tags_data = json_decode($response->getBody()->__toString());

            $tags_data = $tags_data->data->scriptTags->edges;*/
           // if(empty($tags_data) || $tags_data[0]->node->src !== 'https://wearelegion.xyz/js/email-widget.js') {
                
                $query = <<<'QUERY'
                    mutation scriptTagCreate($input: ScriptTagInput!) {
                        scriptTagCreate(input: $input) {
                            scriptTag {
                                id
                                src
                                displayScope
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }
                    QUERY;
                
                $response = $client->query(
                    [
                        "query" => $query,
                        "variables" => [
                            "input" => [
                                "cache" => false,
                                "displayScope" => 'ALL',
                                "src" => "https://wearelegion.xyz/js/email-widget.js",
                            ]
                        ]
                    ]
                );
           // }
        /*
       $query = <<<'QUERY'
                    mutation scriptTagDelete($id: ID!) {
                        scriptTagDelete(id: $id) {
                        deletedScriptTagId
                        userErrors {
                            field
                            message
                        }
                        }
                    }
                    QUERY;

        $response2 = $client->query(
            [
                "query" => $query,
                "variables" => [
                        "id" => 'gid://shopify/ScriptTag/187331510365',
                    ]
            ]
        );
      */

        return $response->getBody()->__toString();
    }

    private static function randomTitle()
    {
        $adjective = self::ADJECTIVES[mt_rand(0, count(self::ADJECTIVES) - 1)];
        $noun = self::NOUNS[mt_rand(0, count(self::NOUNS) - 1)];

        return "$adjective $noun";
    }

    private static function randomPrice()
    {

        return (100.0 + mt_rand(0, 1000)) / 100;
    }

    private const ADJECTIVES = [
        "autumn",
        "hidden",
        "bitter",
        "misty",
        "silent",
        "empty",
        "dry",
        "dark",
        "summer",
        "icy",
        "delicate",
        "quiet",
        "white",
        "cool",
        "spring",
        "winter",
        "patient",
        "twilight",
        "dawn",
        "crimson",
        "wispy",
        "weathered",
        "blue",
        "billowing",
        "broken",
        "cold",
        "damp",
        "falling",
        "frosty",
        "green",
        "long",
    ];

    private const NOUNS = [
        "waterfall",
        "river",
        "breeze",
        "moon",
        "rain",
        "wind",
        "sea",
        "morning",
        "snow",
        "lake",
        "sunset",
        "pine",
        "shadow",
        "leaf",
        "dawn",
        "glitter",
        "forest",
        "hill",
        "cloud",
        "meadow",
        "sun",
        "glade",
        "bird",
        "brook",
        "butterfly",
        "bush",
        "dew",
        "dust",
        "field",
        "fire",
        "flower",
    ];
}
