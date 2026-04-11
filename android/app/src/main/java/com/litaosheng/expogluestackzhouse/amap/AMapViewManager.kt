package com.litaosheng.expogluestackzhouse.amap

import com.amap.api.maps.MapView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class AMapViewManager : SimpleViewManager<MapView>() {

    override fun getName(): String {
        return "AMapView"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): MapView {
        val mapView = MapView(reactContext)
        mapView.onCreate(null) // 必须调用
        return mapView
    }

    override fun onDropViewInstance(view: MapView) {
        super.onDropViewInstance(view)
        view.onDestroy() // 防止内存泄漏
    }
}