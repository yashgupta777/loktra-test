angular.module('services.cart', [])
    .service('Cart', ['$rootScope', 'Reviewer', function ($rootScope, Reviewer) { 
        var cart = JSON.parse(localStorage.cart || '{}');

        var getCart = this.getCart = function () {
            return angular.extend({}, cart);
        };
 
        var addItem = this.addItem = function (id) {  
            (cart[id] || (cart[id] = { quantity: 0 })).quantity++;
            save();
        };
 
        var addItems = this.addItems = function (ids) {
            ids.forEach(addItem);
            save();
        };
 
        // Checks if the cart can be persisted through the Reviewer service: if so, it persists it.
        var save = function () {
            Reviewer.review(cart).then(function (approved) {
                approved && persist();
            });
        };
 
        var remove = this.remove = function (id) {
            delete cart[id] && save();
        };
 
        // Empties the cart
        var clear = this.clear = function () {
            cart = {} && save();
        };
 
        // Persist the cart on the localStorage
        var persist = function () {
            localStorage.cart = JSON.stringify(cart);
            refresh();
        };
 
        // Changes the quantity of one of the items in the cart.
        var changeQuantity = this.changeQuantity = function (id, quantity) {
            cart[id].quantity = quantity;
            save();
        };
 
        // Notifies the application that the cart has been persisted, so that other parts of the app
        // can modify themselves based on the latest cart update.
        var refresh = function () {
            $rootScope.$broadcast('updatedCart');
        };

        angular.element(window).on('storage', function (e) {
            if (e.key !== 'cart') return;

            $rootScope.$apply(function () {
                cart = JSON.parse(localStorage.cart);
                refresh();
            });
        });
    }]);