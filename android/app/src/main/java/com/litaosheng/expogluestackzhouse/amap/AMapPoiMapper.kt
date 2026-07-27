package com.litaosheng.expogluestackzhouse.amap

import com.amap.api.services.core.PoiItem
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class AMapPoiMapper {

  companion object {

    fun poiToMap(poi: PoiItem): WritableMap {

      val map = Arguments.createMap()

      map.putString("poiId", poi.poiId)

      map.putString("title", poi.title)

      map.putString("address", poi.snippet)

      map.putString("province", poi.provinceName)

      map.putString("city", poi.cityName)

      map.putString("adName", poi.adName)

      val point = poi.latLonPoint

      if (point != null) {

        map.putDouble("latitude", point.latitude)

        map.putDouble("longitude", point.longitude)
      }

      return map
    }
  }
}
