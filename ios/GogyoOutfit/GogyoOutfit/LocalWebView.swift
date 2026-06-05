import SwiftUI
import UIKit
import WebKit

struct LocalWebView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = true

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.backgroundColor = .systemBackground
        webView.isOpaque = false
        webView.scrollView.backgroundColor = .systemBackground
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        context.coordinator.loadLocalSite(in: webView)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}
}

extension LocalWebView {
    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        private let webDirectoryName = "Web"
        private let remoteFallbackURL = URL(string: "https://gogyo-outfit-daily-ja.pages.dev")!

        func loadLocalSite(in webView: WKWebView) {
            guard let indexURL = Bundle.main.url(
                forResource: "index",
                withExtension: "html",
                subdirectory: webDirectoryName
            ) else {
                webView.load(URLRequest(url: remoteFallbackURL))
                return
            }

            webView.loadFileURL(indexURL, allowingReadAccessTo: indexURL.deletingLastPathComponent())
        }

        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
        ) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.allow)
                return
            }

            if url.isFileURL {
                decisionHandler(.allow)
                return
            }

            if shouldOpenOutsideApp(url) {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
                return
            }

            decisionHandler(.allow)
        }

        func webView(
            _ webView: WKWebView,
            createWebViewWith configuration: WKWebViewConfiguration,
            for navigationAction: WKNavigationAction,
            windowFeatures: WKWindowFeatures
        ) -> WKWebView? {
            guard let url = navigationAction.request.url else {
                return nil
            }

            if shouldOpenOutsideApp(url) {
                UIApplication.shared.open(url)
            } else {
                webView.load(URLRequest(url: url))
            }

            return nil
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            loadFallbackPage(in: webView, message: error.localizedDescription)
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            loadFallbackPage(in: webView, message: error.localizedDescription)
        }

        private func shouldOpenOutsideApp(_ url: URL) -> Bool {
            guard let scheme = url.scheme?.lowercased() else {
                return false
            }

            if url.host == remoteFallbackURL.host {
                return false
            }

            return ["http", "https", "mailto"].contains(scheme)
        }

        private func loadFallbackPage(in webView: WKWebView, message: String) {
            let html = """
            <!doctype html>
            <html lang="ja">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>五行の装い</title>
                <style>
                  body {
                    margin: 0;
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
                    background: #f8f5ef;
                    color: #24211c;
                  }
                  main {
                    max-width: 30rem;
                    padding: 2rem;
                    text-align: center;
                  }
                  h1 {
                    font-size: 1.4rem;
                    margin: 0 0 0.75rem;
                  }
                  p {
                    line-height: 1.7;
                    margin: 0;
                  }
                </style>
              </head>
              <body>
                <main>
                  <h1>五行の装い</h1>
                  <p>ローカルコンテンツを読み込めませんでした。\(message)</p>
                </main>
              </body>
            </html>
            """

            webView.loadHTMLString(html, baseURL: nil)
        }
    }
}
