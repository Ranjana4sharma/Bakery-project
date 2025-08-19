export interface Category {
  name: string;
  image: string;
  promo?: string;       
  promoCode?: string;   
}

export const CATEGORIES: Category[] = [
  {
    name: 'Cupcakes',
    image: 'https://images.pexels.com/photos/28122543/pexels-photo-28122543.jpeg?auto=compress&w=400',
     promo: 'Cupcake Carnival — Buy 3, Get 1 Free!',
    promoCode: 'CUPCAKE4'
  },
  {
    name: 'Cakes',
    image: 'https://images.pexels.com/photos/10975256/pexels-photo-10975256.jpeg?auto=compress&w=400',
     promo: 'Summer Special - 15% Off Cakes',
    promoCode: 'CAKE15'
  },
  {
    name: 'Brownies',
    image: 'https://assets.bonappetit.com/photos/57bf30b3a184a3c9209db526/1:1/w_2560%2Cc_limit/hillstone-brownie-sundae.jpg',
    promo: '20% Off Brownies This Week!',
    promoCode: 'BROWNIE20'
  },
  {
    name: 'Croissants',
    image: 'https://images.unsplash.com/photo-1681218079567-35aef7c8e7e4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dkphoto.com/id/960924058/photo/cup-of-cappuccino-coffee-with-croissants.jpg?s=612x612&w=0&k=20&c=mGeJTwQ2OOPdTRZgsBsCq6KxrGSLKjwW_pETwyVl9fM=',
  },
  {
    name: 'Waffles',
    image: 'https://images.pexels.com/photos/789327/pexels-photo-789327.jpeg',
  },
  {
    name: 'Pastry',
    image: 'https://media.istockphoto.com/id/1490502264/photo/delicious-bakery-shelf-pastries-display-full-of-colors-and-flavors.jpg?s=612x612&w=0&k=20&c=J-v9tJo0CPC-ncNlo0KnQ0LHQI4UIrLg75xL1cawy64=',
  },
  {
    name: 'Cookies',
    image: 'https://media.istockphoto.com/id/1334833946/photo/warm-cup-of-tea-with-tea-cookies-and-biscuits-on-a-plate.jpg?s=612x612&w=0&k=20&c=LpVbKa29DsUACYyXsewY6KRGTY5sEh5KQbd9F0zyrHE=',
  },
  {
    name: 'Pies',
    image: 'https://media.istockphoto.com/id/1272018182/photo/homemade-cherry-pie-with-lattice-pastry-isolated-on-white.jpg?s=612x612&w=0&k=20&c=FCFGRVcSGbeU8TxF9la7eCAYbPdjcCqBaDJLSwVuYvY=',
  }
];
