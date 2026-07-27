package com.litaosheng.expogluestackzhouse.amap

import com.amap.api.services.core.LatLonPoint
import com.amap.api.services.help.Inputtips
import com.amap.api.services.help.InputtipsQuery
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

// Provide JS with "method call"
class AMapSearchModule(private val reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "AMapSearchModule"
  }

  @ReactMethod
  fun searchTips(keyword: String, promise: Promise) {

    // Create a query object
    val query = InputtipsQuery(keyword, "")

    // false = No restrictions on cities
    query.cityLimit = false

    // Create Inputtips
    val inputTips = Inputtips(reactContext, query)

    // Monitoring result
    inputTips.setInputtipsListener { tips, code ->

      // 1000 = success
      if (code == 1000) {

        val resultArray = Arguments.createArray()

        tips?.forEach { tip ->
          val map = Arguments.createMap()

          map.putString("name", tip.name)

          map.putString("address", tip.address)

          map.putString("district", tip.district)

          val point: LatLonPoint? = tip.point

          if (point != null) {
            map.putDouble("latitude", point.latitude)

            map.putDouble("longitude", point.longitude)
          }

          resultArray.pushMap(map)
        }

        promise.resolve(resultArray)
      } else {
        promise.reject(code.toString(), "AMapSearchModule: 🚴 Search failed, error code is $code")
      }
    }

    // Initiate an asynchronous search
    inputTips.requestInputtipsAsyn()
  }

  @ReactMethod
  fun searchPoi(latitude: Double, longitude: Double, pageNum: Int, promise: Promise) {

    AMapPoiSearchHelper.searchPoi(reactApplicationContext, latitude, longitude, pageNum) {
            result,
            code ->
      if (code == 1000) {

        val pois = result?.pois

        val array = Arguments.createArray()

        pois?.forEach { poi ->
          val map = AMapPoiMapper.poiToMap(poi)

          array.pushMap(map)
        }

        promise.resolve(array)
      } else {

        promise.reject(code.toString(), "AMapSearchModule: 🚴 Poi search failed")
      }
    }
  }
}
