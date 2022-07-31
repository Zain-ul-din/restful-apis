#include <iostream>
#include <string>
#include <chrono>
#include <thread>

void PrintText (const std::string text) {
    for (int i = 0 ; i < text.length() ; i += 1) {
        std::this_thread::sleep_for (std::chrono::milliseconds(150));
        std::cout << text.at(i);
    }
}

// Driver Code
int main () {
  auto startTime = std::chrono::high_resolution_clock::now();

  std::cout << "Starting Sever .... \n";
  PrintText("npm start \n");
  system("node index.js");

  // calculatate time
  auto endTime = std::chrono::high_resolution_clock::now();
  auto timeTook = std::chrono::duration_cast 
                  <std::chrono::seconds>
                   (endTime - startTime);
  
  std::cout << "\nTime Took : " << timeTook.count () << "\n";
  std::cout << "\n\n\n";
  return 0;
}
