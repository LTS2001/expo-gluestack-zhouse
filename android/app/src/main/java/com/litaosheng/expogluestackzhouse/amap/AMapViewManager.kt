package com.litaosheng.expogluestackzhouse.amap

import com.amap.api.maps.AMap
import com.amap.api.maps.MapView
import com.amap.api.maps.model.MyLocationStyle
import com.amap.api.location.AMapLocationClient
import com.amap.api.location.AMapLocationClientOption
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class AMapViewManager : SimpleViewManager<MapView>() {

  override fun getName(): String {
    return "AMapView"
  }

  override fun createViewInstance(reactContext: ThemedReactContext): MapView {
    val mapView = MapView(reactContext)
    mapView.onCreate(null)

    val aMap = mapView.map

    // ✅ 开启蓝点
    aMap.isMyLocationEnabled = true

    val myLocationStyle = MyLocationStyle()
    myLocationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE)
    aMap.myLocationStyle = myLocationStyle

    // ❗新增：主动发起定位
    val locationClient = AMapLocationClient(reactContext)
    val locationOption = AMapLocationClientOption()

    locationOption.locationMode = AMapLocationClientOption.AMapLocationMode.Hight_Accuracy
    locationOption.isOnceLocation = false // 持续定位
    locationOption.interval = 2000

    locationClient.setLocationOption(locationOption)

    locationClient.setLocationListener { location ->
        if (location != null && location.errorCode == 0) {
            val lat = location.latitude
            val lng = location.longitude

            // 👉 移动地图（可选）
            val latLng = com.amap.api.maps.model.LatLng(lat, lng)
            aMap.moveCamera(
                com.amap.api.maps.CameraUpdateFactory.newLatLngZoom(latLng, 16f)
            )
        }
    }

    locationClient.startLocation()

    return mapView
}

  override fun onDropViewInstance(view: MapView) {
    super.onDropViewInstance(view)
    view.onDestroy() // 防止内存泄漏
  }
}
