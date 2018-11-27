import '../src/scss/main.scss';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;

function showCategory(category_id) {
    $('.aside').empty();
    sessionStorage.setItem('prev-category', category_id);
    jQuery.ajax({
        url: 'https://nit.tron.net.ua/api/product/list/category/' + category_id,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            var $product_grid = $('<div class="product-grid row clearfix">');
            json.forEach(function (product) {
                var $product = $('<div class="product">');
                $product.append($('<h5 class="product-title">').text(product.name));
                $product.attr('data-product-id', product.id);
                $product.append($('<img src="'.concat(product.image_url).concat('" class="image">')));
                if (product.special_price == null) {
                    $product.append($('<span class="price">').text(product.price));
                } else {
                    $product.append($('<span class="price-discount">').text(product.special_price));
                    $product.append($('<span class="price-old">').text(product.price));

                }
                $product.append($('<br>'));
                $product.append($('<button class="btn-success btn button-add-cart">').text('Add to card'));
                var $grid_cell = $('<div class="card col-lg-3 col-md-4 col-sm-6 col-xs-12">');

                $grid_cell.append($product);
                $product_grid.append($grid_cell);

            });
            $product_grid.appendTo('.aside');
        },
    });
}

function showProduct(product_id) {
    $('.aside').empty();
    jQuery.ajax({
        url: 'https://nit.tron.net.ua/api/product/' + product_id,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            var $product_page = $('<div class="product-page">');

            $product_page.append($('<h5 class="page-title">').text(json.name));
            $product_page.append($('<button class="page-button btn btn-primary">').attr('data-product-id', product_id).text('Add to cart'));
            $product_page.append($('<img src="'.concat(json.image_url).concat('" class="page-image">')));
            $product_page.append($('<br>'));
            if (json.special_price == null) {
                $product_page.append($('<span class="page-price">').text(json.price));
            } else {
                $product_page.append($('<span class="page-price-discount">').text(json.special_price));
                $product_page.append($('<span class="page-price-old">').text(json.price));
            }

            $product_page.append($('<p class="description">').text(json.description));

            $product_page.appendTo('.aside');

        },
    });
}

function showAll() {
    $('.aside').empty();
    sessionStorage.setItem('prev-category', 'all-products');

    jQuery.ajax({
        url: 'https://nit.tron.net.ua/api/product/list/',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            var $product_grid = $('<div class="product-grid row clearfix">');
            json.forEach(function (product) {
                var $product = $('<div class="product">');
                $product.attr('data-product-id', product.id);
                $product.append($('<h5 class="product-title">').text(product.name));
                $product.append($('<img src="'.concat(product.image_url).concat('" class="image">')));
                if (product.special_price == null) {
                    $product.append($('<span class="price">').text(product.price));
                } else {
                    $product.append($('<span class="price-discount">').text(product.special_price));
                    $product.append($('<span class="price-old">').text(product.price));
                }
                $product.append($('<br>'));
                $product.append($('<button class="btn-success btn button-add-cart">').text('Add to card'));
                var $grid_cell = $('<div class="card col-lg-3 col-md-4 col-sm-6 col-xs-12">');

                $grid_cell.append($product);
                $product_grid.append($grid_cell);

            });

            $product_grid.appendTo('.aside');
        },
    });
}

function loadCategories() {
    sessionStorage.setItem('cat_history', '0|');
    $(document).on('click', '.go-return', function () {
        var $prev = sessionStorage.getItem('prev-category');
        if($prev == undefined){
            return;
        }
        if($prev==='all-products'){
            showAll()
        } else {
            showCategory($prev);
        }
    });
    jQuery.ajax({
        url: 'https://nit.tron.net.ua/api/category/list',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            json.forEach(function (category) {
                var $category = $('<li class="btn btn-default btn-block category">');
                $category.text(category.name);
                $category.click(function () {
                    showCategory(category.id);
                });
                $category.appendTo('.categories');
            });
        },
    });
}

function addToCart(product_id, quantity) {
    var $cart = sessionStorage.getItem('cart');
    if ($cart == null) {
        $cart = product_id + ";";
        sessionStorage.setItem('cart-prod-' + product_id, '1');
        sessionStorage.setItem('cart', $cart);
    } else if ($cart.includes(product_id + ";")) {
        var $count = parseInt(sessionStorage.getItem('cart-prod-' + product_id));
        $count += quantity;
        sessionStorage.setItem('cart-prod-' + product_id, $count + "");
    } else {
        $cart = $cart.concat(product_id + ";");
        sessionStorage.setItem('cart-prod-' + product_id, '1');
        sessionStorage.setItem('cart', $cart);
    }

}

function showCart() {
    $('.cart-list').empty();
    var $list = sessionStorage.getItem('cart');
    if ($list === '' || $list == undefined) {
        ($('<p class="cart-empty">').text('The cart is empty')).appendTo('.cart-list');
        $('#buy-form').removeClass('active-cart').addClass('hidden-cart');
        return;
    } else {
        $('#buy-form').removeClass('hidden-cart').addClass('active-cart');
    }
    var $total = 0;
    $list.split(';').forEach(function (product_id) {
        if (product_id === '') return;
        jQuery.ajax({
            url: 'https://nit.tron.net.ua/api/product/' + product_id.trim(),
            method: 'get',
            dataType: 'json',
            success: function (json) {
                var $product_list = $('<li class="cart-item">');
                var $quantity = parseInt(sessionStorage.getItem('cart-prod-' + product_id));
                $product_list.attr('data-product-id', product_id);
                $product_list.attr('data-product-quantity', $quantity);

                $product_list.append($('<span class="glyphicon glyphicon-remove remove-product">'));
                $product_list.append($('<a class="cart-item-title btn btn-link">').text(json.name));
                $product_list.append($('<button class="quantity-button-minus">').text('-'));
                $product_list.append($('<span class="cart-item-quantity">').text($quantity));
                $product_list.append($('<button class="quantity-button-plus">').text('+'));
                if (json.special_price != null) {
                    $total += parseFloat(json.special_price) * $quantity;
                    $product_list.append($('<span class="cart-item-price">').text(parseFloat(json.special_price) * $quantity));
                    $product_list.attr('data-product-price', json.special_price);
                } else {
                    $total += parseFloat(json.price) * $quantity;
                    $product_list.append($('<span class="cart-item-price">').text(parseFloat(json.price) * $quantity));
                    $product_list.attr('data-product-price', json.price);
                }


                $product_list.appendTo('.cart-list');

            },
        });

    });

}

$(document).on('click', '.button-add-cart', function () {
    var $product_id = $(this.parentNode).data('product-id');
    addToCart($product_id, 1);
});

$(document).on('click', '.image', function () {
    var $product_id = $(this.parentNode).data('product-id');
    showProduct($product_id);
});

$(document).on('click', '.button-shopping-card', function () {
    var $cart_view = $('.cart-view');
    $cart_view.removeClass('hidden-cart').addClass('active-cart');
    showCart();

});

$(document).on('click', '.close-cart', function () {
    var $cart_view = $('.cart-view');
    $cart_view.removeClass('active-cart').addClass('hidden-cart');
});

$(document).on('submit', '#buy-form', function (event) {
    event.preventDefault();
    var $flname = $(this).find('input[name="flname"]').val();
    var $email = $(this).find('input[name="email"]').val();
    var $phone = $(this).find('input[name="phone"]').val();
    var $params = {
        'token': 'y9mihwu4c_flhSiAzhl1',
        'name': $flname,
        'phone': $phone,
        'email': $email,
    };
    sessionStorage.cart.split(';').forEach(function (product_id) {
        if (product_id === '') return;
        $params['products[' + product_id + ']'] = sessionStorage.getItem('cart-prod-' + product_id);
    });
    jQuery.ajax({
        url: 'https://nit.tron.net.ua/api/order/add',
        method: 'post',
        dataType: 'json',
        data: $params,
        success: function (json) {
            var $para = $('.errors');
            var $ok = $('.operation_ok');
            $ok.empty();
            $para.empty();
            console.log(json);
            if (json.status === 'error') {
                if (json.errors.products !== undefined) {
                    $para.append($('<li>').text('You must select some products first.'));
                }
                if (json.errors.name !== undefined) {
                    json.errors.name.forEach(function (error) {
                        $para.append($('<li>').text(error));
                    });
                }
                if (json.errors.email !== undefined) {
                    json.errors.email.forEach(function (error) {

                        $para.append($('<li>').text(error));
                    });
                }
                if (json.errors.phone !== undefined) {
                    json.errors.phone.forEach(function (error) {
                        $para.append($('<li>').text(error));
                    });
                }
            } else {
                $ok.text("Operation successful!");
            }
        },
    });
});

$(document).on('click', '.quantity-button-minus', function () {
    var $product_id = $(this.parentNode).data('product-id');
    var $product_price = parseFloat($(this.parentNode).data('product-price'));

    if (sessionStorage.getItem('cart-prod-' + $product_id) !== '1') {
        var $quantity = parseInt(sessionStorage.getItem('cart-prod-' + $product_id)) - 1;
        sessionStorage.setItem('cart-prod-' + $product_id, $quantity);
        var $list_item = $("li[data-product-id='" + $product_id + "']");
        $list_item.find('.cart-item-quantity').text($quantity);
        $list_item.find('.cart-item-price').text($quantity * $product_price);
    } else {
        sessionStorage.removeItem('cart-prod-' + $product_id);
        var $list = sessionStorage.cart;
        $list = $list.replace($product_id + ';', '');
        sessionStorage.setItem('cart', $list);
        showCart();
    }
});

$(document).on('click', '.quantity-button-plus', function () {
    var $product_id = $(this.parentNode).data('product-id');
    var $product_price = parseFloat($(this.parentNode).data('product-price'));
    var $quantity = parseInt(sessionStorage.getItem('cart-prod-' + $product_id)) + 1;
    sessionStorage.setItem('cart-prod-' + $product_id, $quantity);
    var $list_item = $("li[data-product-id='" + $product_id + "']");
    $list_item.find('.cart-item-quantity').text($quantity);
    $list_item.find('.cart-item-price').text($quantity * $product_price);
});

$(document).on('click', '.page-button', function () {
    addToCart($(this).data('product-id'), 1);
});

$(document).on('click', '.remove-product', function () {
    var $product_id = $(this.parentNode).data('product-id');
    sessionStorage.removeItem('cart-prod-' + $product_id);
    var $list = sessionStorage.cart;
    $list = $list.replace($product_id + ';', '');
    sessionStorage.setItem('cart', $list);
    showCart();
});

loadCategories();
showAll();
