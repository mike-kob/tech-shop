import '../src/scss/main.scss';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;

function showCategory(category_id, price) {
    $('.aside').empty();
    // sessionStorage.setItem('prev-category', category_id);
    var $category_q = "";
    if (category_id === undefined || category_id.length == 0) {

    } else {
        $category_q = '&category=' + category_id.join(',');
    }

    jQuery.ajax({
        url: 'https://tranquil-bayou-20279.herokuapp.com/api/product/' + "?price="+price + $category_q,
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
                var $grid_cell = $('<div class="card col-lg-3 col-md-12 col-sm-12 col-xs-12">');

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
        url: 'https://tranquil-bayou-20279.herokuapp.com/api/product/' + product_id,
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
        url: 'https://tranquil-bayou-20279.herokuapp.com/api/product/',
        method: 'get',
        dataType: 'json',

        success: function (json) {
            console.log("json");
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
                var $grid_cell = $('<div class="card col-lg-3 col-md-4 col-sm-12 col-xs-12">');

                $grid_cell.append($product);
                $product_grid.append($grid_cell);

            });

            $product_grid.appendTo('.aside');
        },
    });
}

function loadCategories() {
    $(document).on('click', '.go-return', function () {
        var $prev = sessionStorage.getItem('prev-category');
        if ($prev == undefined) {
            return;
        }
        if ($prev === 'all-products') {
            showAll()
        } else {
            showCategory($prev);
        }
    });
    jQuery.ajax({
        url: 'https://tranquil-bayou-20279.herokuapp.com/api/category/',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            json.forEach(function (category) {
                var $li_category = $('<li class="checkbox">');
                var $label_category = $('<label class="li_category"><input type="checkbox" class="category-input">' + category.name + '</label>');

                $label_category.attr('data-category-id', category.id);
                $li_category.append($label_category);
                $li_category.append($label_category);
                $li_category.appendTo('ul.category');
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
        $('.operation_ok').removeClass('active-cart').addClass('hidden-cart');
        $('.errors').removeClass('active-cart').addClass('hidden-cart');
        return;
    } else {
        $('#buy-form').removeClass('hidden-cart').addClass('active-cart');
        $('.operation_ok').removeClass('hidden-cart').addClass('active-cart');
        $('.errors').removeClass('hidden-cart').addClass('active-cart');
    }
    var $total = 0;
    $list.split(';').forEach(function (product_id) {
        if (product_id === '') return;
        jQuery.ajax({
            url: 'https://tranquil-bayou-20279.herokuapp.com/api/product/' + product_id.trim(),
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

$(document).on('submit', '#select-form', function (event) {
    event.preventDefault();
    var $selected_cat = [];
    $(".category-input").each(function (index) {
        if(this.checked){
            $selected_cat.push($(this.parentNode).data('category-id'));
        }
    });

    var $price_lo = $('.price-lo').val();
    var $price_hi = $('.price-hi').val();
    if($price_lo==="") $price_lo= "0";
    if($price_hi==="") $price_hi= "0";

    showCategory($selected_cat, $price_lo + '-' + $price_hi);
});

$(document).on('submit', '#buy-form', function (event) {
    event.preventDefault();
    var $flname = $(this).find('input[name="flname"]').val();
    var $email = $(this).find('input[name="email"]').val();
    var $phone = $(this).find('input[name="phone"]').val();

    var $items = [];

    sessionStorage.cart.split(';').forEach(function (product_id) {
        if (product_id === '') return;
        var $item = {};
        $item['product'] = product_id;
        $item['quantity'] = sessionStorage.getItem('cart-prod-' + product_id);

        $items.push($item);
    });

    var $params = {};
    $params['name'] = $flname;
    $params['phone'] = $phone;
    $params['email'] = $email;
    $params['items'] = $items;


    jQuery.ajax({
        url: 'https://tranquil-bayou-20279.herokuapp.com/api/order/',
        method: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify($params),
        success: function (json) {
            var $para = $('.errors');
            var $ok = $('.operation_ok');
            $ok.empty();
            $para.empty();

            $ok.text("Operation successful!");
            console.log('jfakljfsalkjaslk');
            sessionStorage.cart.split(';').forEach(function (product_id) {
                if (product_id === '') return;
                sessionStorage.removeItem('cart-prod-' + product_id);
            });
            sessionStorage.removeItem('cart');
        },
        error: function (jqXHR, status, thrownError) {
            var $para = $('.errors');
            var $ok = $('.operation_ok');
            $ok.empty();
            $para.empty();
            var json = jQuery.parseJSON(jqXHR.responseText);
            if (json.items !== undefined) {
                $para.append($('<li>').text('You must select some products first.'));
            }
            if (json.name !== undefined) {
                json.name.forEach(function (error) {
                    $para.append($('<li>').text("Name: " + error));
                });
            }
            if (json.email !== undefined) {
                json.email.forEach(function (error) {

                    $para.append($('<li>').text("Email: " + error));
                });
            }
            if (json.phone !== undefined) {
                json.phone.forEach(function (error) {
                    $para.append($('<li>').text("Phone: " + error));
                });
            }

        }
    });
})
;

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

$(document).on('click', '.all_products', function () {
    showAll();
});

$('.dropdown-menu').on({
    "click": function (e) {
        e.stopPropagation();
    }
});

loadCategories();
showAll();
