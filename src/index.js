import '../src/scss/main.scss';
import $ from 'jquery';

function showCategory(category_id) {
    $('.card').remove();

    jQuery.ajax({
    url: 'http://nit.tron.net.ua/api/product/list/category/' + category_id,
    method: 'get',
    dataType: 'json',
    success: function (json) {
        json.forEach(function (product) {
            var $product = $('<div class="product">');
            $product.append($('<h5 class="product-title">').text(product.name));
            $product.append($('<img src="'.concat(product.image_url).concat('" class="image">')));
            if (product.special_price == null) {
                $product.append($('<span class="price">').text(product.price));
            } else {
                $product.append($('<span class="price-discount">').text(product.special_price));
                $product.append($('<span class="price-old">').text(product.price));
            }

            //$product.append($('<p class="description">').text(product.description));
            var $grid_cell = $('<div class="card col-lg-3 col-md-4 col-sm-6 col-xs-12">');
            $grid_cell.append($product);
            $grid_cell.appendTo('.product-grid');
        });
    },
});
}

jQuery.ajax({
    url: 'http://nit.tron.net.ua/api/category/list',
    method: 'get',
    dataType: 'json',
    success: function (json) {
        json.forEach(function (category) {
            var $category = $('<button type="button" class="btn btn-primary">');
            $category.text(category.name);
            $category.click(function (){
                showCategory(category.id);
                console.log("lol");
            });
            $category.appendTo('.categories');
        });
    },
});

showCategory(1);