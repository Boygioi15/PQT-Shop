import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-add-new-item.dto';
import { updateCartItemAmountDto } from './dto/update-cart-item-amount.dto';
import { SelectCartItemsByShopDto } from './dto/select-cart-items-by-shop.dto';
import { Public } from 'src/decorator/customize';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  createAnonymous() {
    return this.cartService.createAnonymous();
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('fetch/:id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Post('add-item/:cartId')
  @Public()
  addNewItemToCart(
    @Param('cartId') id: string,
    @Body() newCartItemDto: CartItemDto,
  ) {
    return this.cartService.addItemToCart(id, newCartItemDto);
  }

  @Delete('/remove-item/:cartId/items/:cartItemId')
  @Public()
  removeItemFromCart(
    @Param('cartId') cartID: string,
    @Param('cartItemId') cartItemID: string,
  ) {
    return this.cartService.removeItemFromCart(cartID, cartItemID);
  }

  @Post('update-amount/:cartId/items/:cartItemId/')
  @Public()
  updateCartItemAmount(
    @Param('cartId') cartID: string,
    @Param('cartItemId') cartItemID: string,
    @Body() updateCartItemAmountDto: updateCartItemAmountDto,
  ) {
    return this.cartService.updateItemQuantityInCart(
      cartID,
      cartItemID,
      updateCartItemAmountDto,
    );
  }

  @Put('/clear-cart/:id')
  clearCart(@Param('id') id: string) {
    return this.cartService.clearCart(id);
  }
}
