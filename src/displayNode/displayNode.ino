#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <BlynkSimpleEsp8266.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_RESET 0  // GPIO0
Adafruit_SSD1306 display(OLED_RESET);

char auth[] = "MuDT7u28EtP6-C6cBvobV29faMUGpO_0";

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

BlynkTimer timer;

float lux = 0;
float temp = 0;
float humi = 0;

BLYNK_WRITE(V1)
{
  temp = param.asFloat();
}

BLYNK_WRITE(V0){
  lux = param.asFloat();
}

BLYNK_WRITE(V2){
  humi = param.asFloat();
}

void checkConnect()
{
  if (!Blynk.connected()){
    Serial.println("Blynk disconnected");
    if (!WiFi.isConnected()){
      Serial.println("Wifi disconnect -> Try reset");
      ESP.reset();
    }
  }
}

void setup() {
  Serial.begin(115200);

  WiFiManager wifiManager;
  wifiManager.setAPCallback(configModeCallback);
  wifiManager.setTimeout(150);
  if(!wifiManager.autoConnect("Display Node")) {
    Serial.println("Failed to connect and hit timeout");
    ESP.reset();
  }
  Serial.println("Wifi connected");

  Blynk.config(auth);
  Blynk.connect(5000);
  if (!Blynk.connected()){
    Serial.println("Warning: Cannot connect to Blynk");
  }
  else{
    Serial.println("All connected.... yeey :))");
  }
  timer.setInterval(3000L, checkConnect);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.display();
}

void loop(){
  Blynk.run();
  timer.run();

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 2);
  display.print("Brightness");
  display.setTextSize(2);
  display.setCursor(0, 18);
  display.printf("%.1f", lux);
  display.setTextSize(1);
  display.setCursor(45, 38);
  display.print("lux");
  display.display();

  delay(1000);

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 2);
  display.print("Degree");
  display.setTextSize(2);
  display.setCursor(0, 18);
  display.printf("%.1f", temp);
  display.setTextSize(1);
  display.setCursor(49, 38);
  display.print((char)247);
  display.print("C");
  display.display();

  delay(1000);

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 2);
  display.print("Humidity");
  display.setTextSize(2);
  display.setCursor(0, 18);
  display.printf("%.1f", humi);
  display.setTextSize(1);
  display.setCursor(53, 38);
  display.print("%");
  display.display();

  delay(1000);
}
