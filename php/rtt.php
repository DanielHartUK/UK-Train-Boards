<?php

/*
RTT Encapuslation Class v1.0
Hugh Wells 2018

Nb: this expects $username and $password to be passed as a constructor - else it won't work!
It also needs a copy of Rail References (a converter between varius CORPUS codes) - please find one here: https://gist.github.com/crablab/93a50eeb338646614287eddc3c2776b1
*/

class rtt{
    protected $username;
    protected $password;
    protected $railReferences = "../assets/railReferences.json";

    function __construct($username, $password){
        if(empty($username) || empty($password)){
            throw new exception("Missing RTT credentials");
        } else {
            $this->username = $username;
            $this->password = $password;
        } 
    }

    private function doCurl($query_string){
        $login = $this->username;
        $password = $this->password;
        $url = 'https://api.rtt.io/api/v1/json/' . $query_string;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
        $result = curl_exec($ch);
        curl_close($ch);  
        return json_decode($result);
    }

    private function tiplocToCrs($tiploc){
        if(empty($crs) || empty($this->railReferences)) return false;

        if(file_exists($thos->railReferences)){
            foreach(json_decode(fopen($this->railReferences, "r"), true) as $key => $value){
                if($tiploc == $value['TiplocCode']){
                    return $value['CrsCode'];
                }
            }
            return false;
        } else {
            return false;
        }        
    }   

    private function convertFormat($value, $detail, $type){
        
        $locs = [];

        try{
            if(strtoupper($detail) == "HIGH"){
                //convert date
                $date = str_replace("-", "/", $value->runDate);
                //get all the calling points
                $data = $this->doCurl("service/" . $value->serviceUid . "/" . $date);

                foreach ($data->locations as $key => $loc) {
                    $loc_san = [
                        "locationName" => $loc->description,
                        "crs" => $loc->crs,
                        "st" => (!empty($loc->realtimeArrival) ? $loc->realtimeArrival : null),
                        "et" => (!empty($loc->realtimeGbttDepartureLateness) ? $loc->realtimeGbttDepartureLateness : "On time")
                    ];
                    array_push($locs, $loc_san);
                }
            }

            //Set up the JSON
            $temp = [
                ($type == "ARRIVALS" ? "eta" : "std") => ($type == "ARRIVALS" ? $value->locationDetail->gbttBookedArrival : $value->locationDetail->gbttBookedDeparture),
                "etd" => ($type == "ARRIVALS" ? null : $value->locationDetail->realtimeDeparture),
                "platform" => $value->locationDetail->platform,
                "operator" => $value->atocName, 
                "operatorCode" => $value->atocCode, 
                "serviceType" => $value->serviceType, 
                "serviceID" => $value->serviceUid,
                "origin" => [
                    "location" => [
                        "locationName" => $value->locationDetail->origin{0}->description, 
                        "crs" => $this->tiplocToCrs($value->locationDetail->origin{0}->tiploc)
                    ]
                ], 
                "destination" => [
                    "location" => [
                        "locationName" => $value->locationDetail->destination{0}->description, 
                        "crs" => $this->tiplocToCrs($value->locationDetail->destination{0}->tiploc)
                    ]
                ], 
                "subsequentCallingPoints" => [
                    "callingPointList" => $locs
                ],
                "serviceChangeRequired" => false, 
                "assocIsCancelled" => (!empty($value->locationDetail->cancelReasonCode) ? true : false)
            ];

            return $temp;
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function getServices($crs, $type="departures", $detail="low", $rows=20){
        $type = strtoupper($type);
        if(empty($crs)) return false;

        $data = $this->doCurl("search/" . $crs . "/" . strtolower($type));
        $sanitised = [];

        if(!empty($data->services{0})){      
            foreach ($data->services as $key => $value) {
                $out = $this->convertFormat($value, $detail, $type);
                array_push($sanitised, $out);
            }

            array_slice($sanitised, 0, $rows);
        } else {
            $sanitised = [];
        }

        return $sanitised;
    }
}