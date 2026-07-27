package com.litaosheng.expogluestackzhouse.amap

import android.os.Handler
import android.os.Looper
import com.amap.api.location.AMapLocationClient
import com.amap.api.location.AMapLocationClientOption
import com.amap.api.maps.MapView
import com.amap.api.maps.model.MyLocationStyle
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.litaosheng.expogluestackzhouse.R

class AMapViewManager : SimpleViewManager<MapView>() {

  override fun getName(): String {
    return "AMapView"
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    return mutableMapOf(
            AMapEvent.ON_POI_SEARCH to mutableMapOf("registrationName" to AMapEvent.ON_POI_SEARCH),
            AMapEvent.ON_POI_SEARCH_START to
                    mutableMapOf("registrationName" to AMapEvent.ON_POI_SEARCH_START)
    )
  }

  override fun receiveCommand(
          root: MapView,
          commandId: String,
          args: com.facebook.react.bridge.ReadableArray?
  ) {

    super.receiveCommand(root, commandId, args)

    val aMap = root.map

    when (commandId) {
      "moveToLocation" -> {

        val params = args?.getMap(0)

        val lat = params?.getNullableDouble("latitude")

        val lng = params?.getNullableDouble("longitude")

        val zoom = params?.getNullableDouble("zoom")?.toFloat()

        val triggerMapSearch = params?.getNullableBoolean("triggerMapSearch") ?: false

        if (lat != null && lng != null) {
          if (triggerMapSearch) {

            root.setTag(R.id.map_is_programmatic_move, false)
          } else {

            root.setTag(R.id.map_is_programmatic_move, true)
          }

          val latLng = com.amap.api.maps.model.LatLng(lat, lng)

          if (zoom != null) {

            aMap.animateCamera(com.amap.api.maps.CameraUpdateFactory.newLatLngZoom(latLng, zoom))
          } else {

            aMap.animateCamera(com.amap.api.maps.CameraUpdateFactory.newLatLng(latLng))
          }
        } else {

          val latLng = root.getTag(R.id.map_location) as? com.amap.api.maps.model.LatLng

          if (latLng != null) {

            if (zoom != null) {

              aMap.animateCamera(com.amap.api.maps.CameraUpdateFactory.newLatLngZoom(latLng, zoom))
            } else {

              aMap.animateCamera(com.amap.api.maps.CameraUpdateFactory.newLatLng(latLng))
            }
          } else {

            android.util.Log.d("AMapViewManager", "🚴 Not located yet, unable to move")
          }
        }
      }
    }
  }

  override fun createViewInstance(reactContext: ThemedReactContext): MapView {

    var isFirstLocate = true

    val mapView = MapView(reactContext)

    mapView.onCreate(null)

    val handler = Handler(Looper.getMainLooper())

    var searchRunnable: Runnable? = null

    val aMap = mapView.map

    /**
     * Register a "map perspective change monitor" for Gaode map. When users drag, zoom and rotate
     * the map, they can monitor the change of the center point of the map.
     */
    aMap.setOnCameraChangeListener(
            object : com.amap.api.maps.AMap.OnCameraChangeListener {

              // Triggered continuously during the map movement.
              override fun onCameraChange(position: com.amap.api.maps.model.CameraPosition?) {}

              // Triggered once when the map stops moving.
              override fun onCameraChangeFinish(position: com.amap.api.maps.model.CameraPosition?) {

                val isProgrammaticMove =
                        mapView.getTag(R.id.map_is_programmatic_move) as? Boolean ?: false

                if (isProgrammaticMove) {

                  mapView.setTag(R.id.map_is_programmatic_move, false)
                  return
                }

                if (position != null) {

                  val lat = position.target.latitude

                  val lng = position.target.longitude

                  AMapEvent.sendEvent(mapView, reactContext, AMapEvent.ON_POI_SEARCH_START)

                  // Cancel the previous search
                  searchRunnable?.let { handler.removeCallbacks(it) }

                  // Create a new search task
                  searchRunnable = Runnable {
                    AMapPoiSearchHelper.searchPoi(reactContext, lat, lng, 0) { result, code ->
                      if (code == 1000) {

                        val pois = result?.pois

                        val poiArray = Arguments.createArray()

                        pois?.forEach { poi ->
                          val map = AMapPoiMapper.poiToMap(poi)

                          poiArray.pushMap(map)
                        }

                        val event = Arguments.createMap()

                        event.putArray("pois", poiArray)

                        val center = Arguments.createMap()

                        center.putDouble("latitude", lat)

                        center.putDouble("longitude", lng)

                        event.putMap("center", center)

                        AMapEvent.sendEvent(mapView, reactContext, AMapEvent.ON_POI_SEARCH, event)
                      }
                    }
                  }

                  // Delay execution by 500ms
                  handler.postDelayed(searchRunnable!!, 500)
                }
              }
            }
    )

    aMap.isMyLocationEnabled = true

    val myLocationStyle = MyLocationStyle()

    myLocationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE_NO_CENTER)

    aMap.myLocationStyle = myLocationStyle

    // Active positioning
    val locationClient = AMapLocationClient(reactContext)

    val locationOption = AMapLocationClientOption()

    locationOption.locationMode = AMapLocationClientOption.AMapLocationMode.Hight_Accuracy

    // Continuous positioning
    locationOption.isOnceLocation = false

    locationOption.interval = 2000

    locationClient.setLocationOption(locationOption)

    locationClient.setLocationListener { location ->
      if (location != null && location.errorCode == 0) {

        val lat = location.latitude

        val lng = location.longitude

        val latLng = com.amap.api.maps.model.LatLng(lat, lng)

        mapView.setTag(R.id.map_location, latLng)

        // Move the map only at the first positioning
        if (isFirstLocate) {

          isFirstLocate = false

          aMap.animateCamera(com.amap.api.maps.CameraUpdateFactory.newLatLngZoom(latLng, 16f))
        }
      }
    }

    locationClient.startLocation()

    mapView.setTag(R.id.map_location_client, locationClient)

    return mapView
  }

  override fun onDropViewInstance(view: MapView) {

    super.onDropViewInstance(view)

    Handler(Looper.getMainLooper())
            .postDelayed(
                    {
                      // Prevent memory leakage
                      view.onDestroy()
                    },
                    500
            )

    val locationClient = view.getTag(R.id.map_location_client) as? AMapLocationClient

    locationClient?.stopLocation()

    locationClient?.onDestroy()
  }
}
