#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <BlynkSimpleEsp8266.h>

char auth[] = "XDxuyhKerygWslUd7R9h36XGzUbo5gNi";

int setHumi = 60;
int humi = 0;
int mistStatus;

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

BlynkTimer timer;

BLYNK_WRITE(V0)
{
  setHumi = param.asInt();
  if (setHumi > humi)
  {
    mistStatus = 1;
  }
  else
  {
    mistStatus = 0;
  }
  Blynk.virtualWrite(V2, mistStatus);
}

BLYNK_WRITE(V1){
    humi = param.asInt();
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
  if(!wifiManager.autoConnect("Mist Node")) {
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
  pinMode(D1, OUTPUT);
  if (setHumi > humi)
  {
    mistStatus = 1;
  }
  else
  {
    mistStatus = 0;
  }
}

void loop(){
  Blynk.run();
  timer.run();
  if (setHumi > humi)
  {
    mistStatus = 1;
  }
  else
  {
    mistStatus = 0;
  }
  digitalWrite(D1, mistStatus);
}
