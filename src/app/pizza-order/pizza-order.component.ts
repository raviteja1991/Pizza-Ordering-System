import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-pizza-order',
  templateUrl: './pizza-order.component.html',
  styleUrls: ['./pizza-order.component.scss']
})
export class PizzaOrderComponent implements OnInit {
  constructor() { }

  sizeOfPizza: any = {
    small: {
      price: 5
    }, medium: {
      price: 7
    }, large: {
      price: 8
    }, extraLarge: {
      price: 9
    },
  }

  pizzaToppings: any = {
    vegToppings: [{
      topping: 'Tomatoes',
      price: 1
    }, {
      topping: 'Onions',
      price: 0.5
    }, {
      topping: 'Bell Pepper',
      price: 1
    }, {
      topping: 'Mushrooms',
      price: 1.2
    }, {
      topping: 'Pineapple',
      price: 0.75
    }],
    nonVegToppings: [{
      topping: 'Sausage',
      price: 1
    }, {
      topping: 'Pepperoni',
      price: 2
    }, {
      topping: 'Barbecue Chicken',
      price: 3
    }]
  }

  promoOfferOne!: string | null;
  promoOfferTwo!: string | null;
  promoOfferThree!: string | null;

  smallDiscount!: number;
  mediumDiscount!: number;
  largeDiscount!: number;

  order: any = {
    small: [],
    medium: [],
    large: [],
    extraLarge: []
  };

  ngOnInit() {
  }

  addToCart(e: { currentTarget: any; }) {
    let target = e.currentTarget;
    let parent = $(target).parents('.btns');
    let size = target.getAttribute('data-field');
    let type = target.getAttribute('data-type');
    var input = parent.find("input[name='" + size + "']");
    var currentVal: number = Number(input.val());
    if (!isNaN(currentVal)) {
      if (type == 'add') {
        if (currentVal < Number(input.attr('max'))) {
          currentVal++;
          input.val(currentVal).change();
          this.pizzaOrderPlaced(size, currentVal, type)
        }
      }
      else if (type == 'remove') {
        if (currentVal > Number(input.attr('min'))) {
          currentVal--;
          input.val(currentVal).change();
          this.pizzaOrderPlaced(size, currentVal, type)
        }
      }
      this.findOutPromotions();
    } else {
      input.val(0);
    }
  }

  pizzaOrderPlaced(size: string, currentVal: number, type: string) {
    if (type == 'add') {
      var orderSize = JSON.parse(JSON.stringify(this.order[size]));
      if (orderSize.length > 0) {
        this.order[size].push(orderSize[0]);
      } else {
        this.order[size].push({
          price: this.sizeOfPizza[size].price,
          pizzaToppings: []
        });
      }
    } else {
      this.order[size].splice(0, 1);
      if (this.order[size].length == 0) {
        let checkVals = document.getElementsByClassName(size + '-checkbox');
        console.log('checkVals', checkVals)
        Array.prototype.forEach.call(checkVals, function (cv, i) {
          cv.checked = false;
        });
      }
    }
  }

  selectPizzaToppings(e: { currentTarget: any; }, obj: { topping: any; }) {
    let target = e.currentTarget, id = target.getAttribute('id'), value = target.value, checked = target.checked, size = target.getAttribute('data-size');
    let chkdTopping = { id: id, name: obj.topping, price: value, checked: checked, size: size }

    if (chkdTopping.checked) {
      this.order[size].forEach((val: any, i: string | number) => {
        this.order[size][i].pizzaToppings.push(chkdTopping)
      })
    } else {
      let index: any;
      let checkItem = this.order[size][0]["pizzaToppings"].find((element: { id: any; }, j: any) => {
        if (element.id === chkdTopping.id) {
          index = j;
          return element;
        } else {
          return undefined;
        }
      });
      this.order[size].forEach((val: any, k: string | number) => {
        this.order[size][k].pizzaToppings.splice(index, 1)
      })
    }
    this.findOutPromotions();
  }

  findOutPromotions() {
    if (this.order.medium.length == 1) {
      this.order.medium.forEach((promo1: { pizzaToppings: any; }) => {
        if ('pizzaToppings' in promo1) {
          let topings = promo1.pizzaToppings;
          if (topings.length == 2) {
            this.promoOfferOne = "Offer One - Applied";
          } else { this.promoOfferOne = null; }
        }
      })
    } else { this.promoOfferOne = null; }

    if (this.order.medium.length == 2) {
      this.order.medium.forEach((promo2: { pizzaToppings: any; }) => {
        if ('pizzaToppings' in promo2) {
          let topings = promo2.pizzaToppings;
          if (topings.length == 4) {
            this.promoOfferTwo = "Offer Two - Applied";
          } else { this.promoOfferTwo = null; }
        }
      })
    } else { this.promoOfferTwo = null; }

    if (this.order.large.length == 1) {
      let pepporoni = false, bbq = false;
      this.order.large.forEach((promo3: { pizzaToppings: any; }) => {
        if ('pizzaToppings' in promo3) {
          let topings = promo3.pizzaToppings;
          topings.forEach((toping: { name: string; }) => {
            debugger;
            if (toping.name.toLowerCase() === 'pepperoni') pepporoni = true;
            if (toping.name.toLowerCase() === 'barbecue chicken') bbq = true;
          })
          debugger;
          if (topings.length == 4 || (pepporoni && bbq)) {
            this.promoOfferTwo = "Offer three - Applied";
          } else { this.promoOfferThree = null; }
        }
      })
    } else { this.promoOfferThree = null; }
  }
}
