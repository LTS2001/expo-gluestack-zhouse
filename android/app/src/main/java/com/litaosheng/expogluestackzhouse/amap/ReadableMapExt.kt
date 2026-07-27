package com.litaosheng.expogluestackzhouse.amap

import com.facebook.react.bridge.ReadableMap

fun ReadableMap.getNullableDouble(key: String): Double? {

  return if (hasKey(key) && !isNull(key)) {
    getDouble(key)
  } else {
    null
  }
}

fun ReadableMap.getNullableInt(key: String): Int? {

  return if (hasKey(key) && !isNull(key)) {
    getInt(key)
  } else {
    null
  }
}

fun ReadableMap.getNullableBoolean(key: String): Boolean? {

  return if (hasKey(key) && !isNull(key)) {
    getBoolean(key)
  } else {
    null
  }
}
