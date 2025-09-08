import React from "react";
import { useRef } from "react";
import {
  Package,
  BarChart3,
  ShoppingCart,
  Calendar,
  MapPin,
  Hash,
  X,
  CircleX,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DialogClose } from "./dialog";

const ProductInfoModal = ({ data }) => {
  const cardContentRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  // export as image
  const exportAsImage = async () => {
    if (!cardContentRef.current) return;

    try {
      const canvas = await html2canvas(cardContentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `${data.productName.replace(/\s+/g, "_")}_info.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error exporting as image:", error);
    }
  };
  // export as pdf
  const exportAsPDF = async () => {
    if (!cardContentRef.current) return;

    try {
      const canvas = await html2canvas(cardContentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${data.productName.replace(/\s+/g, "_")}_info.pdf`);
    } catch (error) {
      console.error("Error exporting as PDF:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl relativ shadow-2xl border border-gray-100 p-6 max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
        <DialogClose asChild>
          {/* <button className="absolute top-2 right-2 cursor-pointer">
            <CircleX className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button> */}
        </DialogClose>
        <div ref={cardContentRef}>
          {/* Header with Close Button */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {data.productName}
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <Hash className="w-4 h-4 mr-1" />
                <span>{data.barcode}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              {/* <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button> */}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-700">
                  {data.quantitySold}
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium">
                Quantity Sold
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-700">
                  {data.ordersCount}
                </span>
              </div>
              <p className="text-sm text-blue-600 font-medium">Total Orders</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Revenue Generated
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  {formatCurrency(data.revenue)}
                </p>
              </div>
              <div className="text-purple-400">
                <BarChart3 className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Last Ordered</span>
              </div>
              <span className="text-sm text-gray-900 font-medium">
                {formatDate(data.lastOrderedDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Warehouse</span>
              </div>
              <span className="text-sm text-gray-900 font-medium uppercase tracking-wide">
                {data.warehouse}
              </span>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-center space-x-3 mb-4 pt-4 border-t border-gray-100">
          <button
            onClick={exportAsImage}
            className="flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Export as Image
          </button>
          <button
            onClick={exportAsPDF}
            className="flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoModal;
