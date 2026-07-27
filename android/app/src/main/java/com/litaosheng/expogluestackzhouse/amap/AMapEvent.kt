package com.litaosheng.expogluestackzhouse.amap

import com.amap.api.maps.MapView
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTModernEventEmitter

class AMapEvent(
        surfaceId: Int,
        viewId: Int,
        private val eventName: String,
        private val eventData: WritableMap?
) : Event<AMapEvent>(surfaceId, viewId) {

  override fun getEventName(): String {
    return eventName
  }

  override fun dispatchModern(rctEventEmitter: RCTModernEventEmitter) {

    rctEventEmitter.receiveEvent(
            surfaceId,
            viewTag,
            eventName,
            canCoalesce(),
            coalescingKey.toInt(),
            eventData,
            eventCategory
    )
  }

  companion object {

    const val ON_POI_SEARCH = "onPoiSearch"

    const val ON_POI_SEARCH_START = "onPoiSearchStart"

    fun sendEvent(
            mapView: MapView,
            reactContext: ThemedReactContext,
            eventName: String,
            params: WritableMap? = null
    ) {

      UIManagerHelper.getEventDispatcherForReactTag(reactContext, mapView.id)
              ?.dispatchEvent(
                      AMapEvent(
                              UIManagerHelper.getSurfaceId(reactContext),
                              mapView.id,
                              eventName,
                              params
                      )
              )
    }
  }
}
