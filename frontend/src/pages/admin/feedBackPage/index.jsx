import React, { useEffect, useState } from "react";
import ProductList from "../../../component/admin/comment/ProductList";
import ProductComments from "../../../component/admin/comment/ProductComment";

const FeedBackPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(() => {
    return sessionStorage.getItem("selectedProduct") || null;
  });

  useEffect(() => {
    if (selectedProduct) {
      sessionStorage.setItem("selectedProduct", selectedProduct);
    } else {
      sessionStorage.removeItem("selectedProduct");
    }

    // Cleanup khi rời khỏi trang
    return () => {
      sessionStorage.removeItem("selectedProduct");
    };
  }, [selectedProduct]);

  return (
    <div className="md:grid md:grid-cols-3 md:justify-start md:items-start gap-10 flex flex-col justify-center items-center w-full min-h-screen md:p-8">
      <div className="md:col-span-1 w-full">
        <ProductList
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      </div>
      <div className="md:col-span-2 w-full h-full">
        <ProductComments
          productId={selectedProduct} // Pass selected product _id
        />
      </div>
    </div>
  );
};

export default FeedBackPage;
