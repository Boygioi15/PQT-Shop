const ProductInfo = () => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800">Product information</h3>
      <table className="w-full table-auto mt-4">
        <tbody className="divide-y divide-gray-300">
          <tr>
            <td className="p-2 text-sm text-gray-800 font-bold">TYPE</td>
            <td className="p-2 text-sm text-gray-800">LAPTOP</td>
          </tr>

          <tr>
            <td className="p-2 text-sm text-gray-800 font-bold">
              DISPLAY RESOLUTION
            </td>
            <td className="p-2 text-sm text-gray-800">2880x1620</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductInfo;
