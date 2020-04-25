#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <BlynkSimpleEsp8266.h>
#include <Wire.h>
#include <WEMOS_Motor.h>

Motor M1(0x30, _MOTOR_A, 1000); //Motor A

char auth[] = "a17t7bcSz-220nbpwZR-rIC13AvSJsWL";

int setTemp = 25;
int temp = 50;
int fanStatus;

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

BlynkTimer timer;

BLYNK_WRITE(V0)
{
  setTemp = param.asInt();
  if (setTemp > temp)
  {
    fanStatus = 0;
  }
  else
  {
    fanStatus = 1;
  }
  Blynk.virtualWrite(V2, fanStatus);
}

BLYNK_WRITE(V1){
    temp = param.asInt();
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
  if(!wifiManager.autoConnect("Fan Node")) {
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
  M1.setmotor(_STANDBY);
  if (setTemp > temp)
  {
    fanStatus = 0;
  }
  else
  {
    fanStatus = 1;
  }
}

void loop(){
  Blynk.run();
  timer.run();
  if (setTemp > temp)
  {
    fanStatus = 0;
  }
  else
  {
    fanStatus = 1;
  }
  if (fanStatus == 1)
  {
    M1.setmotor( _CW, 100);
  }
  else
  {
    M1.setmotor(_STOP);
  }
}
