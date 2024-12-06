import ProductCard from "../../../component/productCard";

const HomePage = () => {
  return (
    <div className="flex flex-wrap justify-center">
      <ProductCard
        name="Dép Xỏ Ngón Nam Columbia Ramble™- Xám"
        brand="Adidas"
        price="499.000"
        reviews={4}
        rating={2}
        imageUrl="https://s3-alpha-sig.figma.com/img/e5bc/ab79/08882ecc4c6d79c11dafa002bd41bac2?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BhJfzWMzsJdjYJAXjKaIaW4DOC22CvXQuLNiYNeq53luZ09h~iQNOHVporN4N8JA2zIFVN06s7MgwxGyi2F-S9FWHQHDO1TDRfcrDGBdCWsK6Mdx7Whhx3VDuzbhAhB-aQzHPknmBVKqP2pFA3YevO0zrY2vaQ6e2x7IedOPqIqZls0ZP83ZMwQAgm4NV7H38UGy8TtBq0VsjCYaNyLi7x0q71aNzmPF8v~2pGQvQH9X2keIy654vXqtdbG7n9KQnHp8RyRZOJ6n~CkjEJFEUBaoym91SESDxfbYSSO8smXbd2VDWrEPDog4rPO0baUyK-dfGckBzwVnNvriTfLyBg__"
        imageUrlHover="https://s3-alpha-sig.figma.com/img/5fce/f6ca/dc73b3fb8b1261d17c73d55c93a3616e?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=D~9ZhqGhURKUn-6L~IFPSD6DQOQ3DTBulqjhfPWtkh6YwfneFzCFk7AlrmxhtueKeo9Fx0BvNW0F4iQP7dVMi6UGQacyH3~xjVJcYTSKhZkiLyY9ZG0u2DWJt8pLb2mAJU7XMUKmWWk-LDJdVaONS3zRoS9c1jPdo-aNRvap0uDgCeVYDPZLF1r6ESiG3sdIKCGWU0zJGallDuyQBsBdqaa4-iZd~uKX6ytwYY0r6sTIBkgaEUkWri5RxGrVa3XCzur5HVDaevhfzKLJBkz08dDxb0yubR8a0aczzUiuAMbMpn3L6wDVyvWVyw5mgWipK9X1ObYCj04ZrNuehMC-JA__"
        isNew={true} // Nếu sản phẩm mới, hiển thị "MỚI"
        isSale={true} // Nếu sản phẩm đang giảm giá, hiển thị "SALE"
      />
      <ProductCard
        name="Dép Xỏ Ngón Nam Columbia Ramble™- Xám"
        brand="Adidas"
        price="499.000"
        reviews={4}
        rating={2}
        imageUrl="https://s3-alpha-sig.figma.com/img/e5bc/ab79/08882ecc4c6d79c11dafa002bd41bac2?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BhJfzWMzsJdjYJAXjKaIaW4DOC22CvXQuLNiYNeq53luZ09h~iQNOHVporN4N8JA2zIFVN06s7MgwxGyi2F-S9FWHQHDO1TDRfcrDGBdCWsK6Mdx7Whhx3VDuzbhAhB-aQzHPknmBVKqP2pFA3YevO0zrY2vaQ6e2x7IedOPqIqZls0ZP83ZMwQAgm4NV7H38UGy8TtBq0VsjCYaNyLi7x0q71aNzmPF8v~2pGQvQH9X2keIy654vXqtdbG7n9KQnHp8RyRZOJ6n~CkjEJFEUBaoym91SESDxfbYSSO8smXbd2VDWrEPDog4rPO0baUyK-dfGckBzwVnNvriTfLyBg__"
        isNew={true} // Nếu sản phẩm mới, hiển thị "MỚI"
        isSale={true} // Nếu sản phẩm đang giảm giá, hiển thị "SALE"
      />
      <ProductCard
        name="Dép Xỏ Ngón Nam Columbia Ramble™- Xám"
        brand="Adidas"
        price="499.000"
        reviews={4}
        rating={2}
        imageUrl="https://s3-alpha-sig.figma.com/img/e5bc/ab79/08882ecc4c6d79c11dafa002bd41bac2?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BhJfzWMzsJdjYJAXjKaIaW4DOC22CvXQuLNiYNeq53luZ09h~iQNOHVporN4N8JA2zIFVN06s7MgwxGyi2F-S9FWHQHDO1TDRfcrDGBdCWsK6Mdx7Whhx3VDuzbhAhB-aQzHPknmBVKqP2pFA3YevO0zrY2vaQ6e2x7IedOPqIqZls0ZP83ZMwQAgm4NV7H38UGy8TtBq0VsjCYaNyLi7x0q71aNzmPF8v~2pGQvQH9X2keIy654vXqtdbG7n9KQnHp8RyRZOJ6n~CkjEJFEUBaoym91SESDxfbYSSO8smXbd2VDWrEPDog4rPO0baUyK-dfGckBzwVnNvriTfLyBg__"
        isNew={true} // Nếu sản phẩm mới, hiển thị "MỚI"
        isSale={true} // Nếu sản phẩm đang giảm giá, hiển thị "SALE"
      />
    </div>
  );
};

export default HomePage;
