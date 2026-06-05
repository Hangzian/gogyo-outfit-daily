import SwiftUI

struct ContentView: View {
    var body: some View {
        LocalWebView()
            .background(Color(.systemBackground))
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
