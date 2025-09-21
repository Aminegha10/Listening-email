"use client";
import {
  Download,
  FileText,
  MoreHorizontal,
  MoreVertical,
  Share2,
} from "lucide-react";
import React, { useState } from "react";

const ShareButton = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Export Menu */}
          {showExportMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-2 min-w-48 animate-in slide-in-from-bottom-2 duration-200">
              <button
                // onClick={handleExportPDF}
                className="w-full cursor-pointer px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
              >
                <FileText className="h-4 w-4 text-red-500" />
                <span className="font-medium ">Export as PDF</span>
              </button>
              <button
                // onClick={handleExportCSV}
                className="w-full cursor-pointer px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
              >
                <Download className="h-4 w-4 text-green-500" />
                <span className="font-medium ">Export as CSV</span>
              </button>
              <button
                // onClick={handleShare}
                className="w-full  cursor-pointer px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
              >
                <Share2 className="h-4 w-4 text-blue-500 " />
                <span className="font-medium ">Share Report</span>
              </button>
            </div>
          )}

          {/* Main FAB */}
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="w-14 cursor-pointer h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          >
            <MoreHorizontal
              className={`h-5 w-5 transition-transform duration-200 ${
                showExportMenu ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>

        {/* Click outside to close */}
        {/* {showExportMenu && (
          <div
            className="fixed inset-0 z-40"
          />
        )} */}
      </div>
    </>
  );
};

export { ShareButton };
