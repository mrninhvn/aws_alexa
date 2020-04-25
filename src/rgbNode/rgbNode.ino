#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <BlynkSimpleEsp8266.h>
#include <Adafruit_NeoPixel.h>

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(1, D2, NEO_GRB + NEO_KHZ800);

char auth[] = "xLvGYq8nj_ROJdi_FMNjWSTO1ZpKMK_n";

int setLight = 50;

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

BlynkTimer timer;

BLYNK_WRITE(V0)
{
  setLight = param.asInt();
  if (setLight < 0)
  {
    setLight = 0;
  }
  if (setLight > 255)
  {
    setLight = 255;
  }
}

BLYNK_WRITE(V1){
    int lux = param.asInt();
    if (setLight - lux < 1)
    {
      pixels.setBrightness(1);
      pixels.show();
    }
    else
    {
      pixels.setBrightness(setLight - lux);
      pixels.show();
    }
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
  pixels.begin();

  WiFiManager wifiManager;
  wifiManager.setAPCallback(configModeCallback);
  wifiManager.setTimeout(150);
  if(!wifiManager.autoConnect("RGB Node")) {
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

  pixels.setPixelColor(0, pixels.Color(255,255,255));
  pixels.show();
}

void loop(){
  Blynk.run();
  timer.run();
}
