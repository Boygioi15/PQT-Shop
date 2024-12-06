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
        isNew={true} // Nếu sản phẩm mới, hiển thị "MỚI"
        isSale={true} // Nếu sản phẩm đang giảm giá, hiển thị "SALE"
      />
    </div>
  );
};

export default HomePage;
