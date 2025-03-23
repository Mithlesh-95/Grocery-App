package com.GroceryAI.groceryapp;

import com.getcapacitor.BridgeActivity;


import android.webkit.WebView;
import android.webkit.WebSettings;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        WebView webView = this.bridge.getWebView();
        WebSettings settings = webView.getSettings();
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setDomStorageEnabled(true);
        webView.setPadding(0, 0, 0, 0); // Remove any default padding
    }
}