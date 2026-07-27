package com.litaosheng.expogluestackzhouse.amap

import android.content.Context
import com.amap.api.services.core.LatLonPoint
import com.amap.api.services.core.PoiItem
import com.amap.api.services.poisearch.PoiResult
import com.amap.api.services.poisearch.PoiSearch

class AMapPoiSearchHelper {

  companion object {

    fun searchPoi(
            context: Context,
            latitude: Double,
            longitude: Double,
            pageNum: Int,
            callback: (result: PoiResult?, code: Int) -> Unit
    ) {

      val query = PoiSearch.Query("", "", "")

      query.pageSize = 20
      query.pageNum = pageNum

      val poiSearch = PoiSearch(context, query)

      val searchBound = PoiSearch.SearchBound(LatLonPoint(latitude, longitude), 1000)

      poiSearch.bound = searchBound

      poiSearch.setOnPoiSearchListener(
              object : PoiSearch.OnPoiSearchListener {

                override fun onPoiSearched(result: PoiResult?, code: Int) {

                  callback(result, code)
                }

                override fun onPoiItemSearched(poiItem: PoiItem?, code: Int) {}
              }
      )

      poiSearch.searchPOIAsyn()
    }
  }
}
