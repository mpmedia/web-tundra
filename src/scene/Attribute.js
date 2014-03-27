"use strict";
/* jslint browser: true, globalstrict: true, devel: true, debug: true */
/* global signals, Tundra */
// For conditions of distribution and use, see copyright notice in LICENSE

if (Tundra === undefined)
    var Tundra = {};

Tundra.cAttributeNoneTypeName = "";
Tundra.cAttributeStringTypeName = "string";
Tundra.cAttributeIntTypeName = "int";
Tundra.cAttributeRealTypeName = "real";
Tundra.cAttributeColorTypeName = "Color";
Tundra.cAttributeFloat2TypeName = "float2";
Tundra.cAttributeFloat3TypeName = "float3";
Tundra.cAttributeFloat4TypeName = "float4";
Tundra.cAttributeBoolTypeName = "bool";
Tundra.cAttributeUIntTypeName = "uint";
Tundra.cAttributeQuatTypeName = "Quat";
Tundra.cAttributeAssetReferenceTypeName = "AssetReference";
Tundra.cAttributeAssetReferenceListTypeName = "AssetReferenceList";
Tundra.cAttributeEntityReferenceTypeName = "EntityReference";
Tundra.cAttributeQVariantTypeName = "QVariant";
Tundra.cAttributeQVariantListTypeName = "QVariantList";
Tundra.cAttributeTransformTypeName = "Transform";
Tundra.cAttributeQPointTypeName = "QPoint";

Tundra.cAttributeNone = 0;
Tundra.cAttributeString = 1;
Tundra.cAttributeInt = 2;
Tundra.cAttributeReal = 3;
Tundra.cAttributeColor = 4;
Tundra.cAttributeFloat2 = 5;
Tundra.cAttributeFloat3 = 6;
Tundra.cAttributeFloat4 = 7;
Tundra.cAttributeBool = 8;
Tundra.cAttributeUInt = 9;
Tundra.cAttributeQuat = 10;
Tundra.cAttributeAssetReference = 11;
Tundra.cAttributeAssetReferenceList = 12;
Tundra.cAttributeEntityReference = 13;
Tundra.cAttributeQVariant = 14;
Tundra.cAttributeQVariantList = 15;
Tundra.cAttributeTransform = 16;
Tundra.cAttributeQPoint = 17;
Tundra.cNumAttributeTypes = 18;

var attributeTypeNames = [
    Tundra.cAttributeNoneTypeName,
    Tundra.cAttributeStringTypeName,
    Tundra.cAttributeIntTypeName,
    Tundra.cAttributeRealTypeName,
    Tundra.cAttributeColorTypeName,
    Tundra.cAttributeFloat2TypeName,
    Tundra.cAttributeFloat3TypeName,
    Tundra.cAttributeFloat4TypeName,
    Tundra.cAttributeBoolTypeName,
    Tundra.cAttributeUIntTypeName,
    Tundra.cAttributeQuatTypeName,
    Tundra.cAttributeAssetReferenceTypeName,
    Tundra.cAttributeAssetReferenceListTypeName,
    Tundra.cAttributeEntityReferenceTypeName,
    Tundra.cAttributeQVariantTypeName,
    Tundra.cAttributeQVariantListTypeName,
    Tundra.cAttributeTransformTypeName,
    Tundra.cAttributeQPointTypeName
];

Tundra.attributeTypeIds = {
    "" : Tundra.cAttributeNone,
    "string" : Tundra.cAttributeString,
    "int" : Tundra.cAttributeInt,
    "real" : Tundra.cAttributeReal,
    "Color" : Tundra.cAttributeColor,
    "float2" : Tundra.cAttributeFloat2,
    "float3" : Tundra.cAttributeFloat3,
    "float4" : Tundra.cAttributeFloat4,
    "bool" : Tundra.cAttributeBool,
    "uint" : Tundra.cAttributeUInt,
    "Quat" : Tundra.cAttributeQuat,
    "AssetReference" : Tundra.cAttributeAssetReference,
    "AssetReferenceList" : Tundra.cAttributeAssetReferenceList,
    "EntityReference" : Tundra.cAttributeEntityReference,
    "QVariant" : Tundra.cAttributeQVariant,
    "QVariantList" : Tundra.cAttributeQVariantList,
    "Transform" : Tundra.cAttributeTransform,
    "QPoint" : Tundra.cAttributeQPoint
};

Tundra.AttributeChange = {
    Default : 0,
    Disconnected : 1,
    LocalOnly : 2,
    Replicate : 3
};

function Attribute(typeId) {
    this.owner = null;
    this.name = "";
    this.id = "";
    this.valueInternal = null;
    this.index = 0;
    this.typeId = typeId;
    this.typeName = attributeTypeNames[typeId];
    this.dynamic = false;
}

Attribute.prototype = {
    set: function(newValue, changeType) {
        if (newValue != null) {
            //TODO: would be good to validate here. as the attributes are typed and all..
            this.valueInternal = newValue;
            if (this.owner)
                this.owner.emitAttributeChanged(this, changeType);
        }
    },

    get value(){
        return this.valueInternal;
    },

    set value(newValue){
        this.set(newValue, Tundra.AttributeChange.Default);
    }
}

// String

function AttributeString() {
    Attribute.call(this, Tundra.cAttributeString);
    this.valueInternal = "";
}
AttributeString.prototype = new Attribute(Tundra.cAttributeString);

AttributeString.prototype.fromBinary = function(dd, changeType){
    this.set(dd.readUtf8String(), changeType);
};

AttributeString.prototype.toBinary = function(ds){
    ds.addUtf8String(this.value);
};

// Int

function AttributeInt() {
    Attribute.call(this, Tundra.cAttributeInt);
    this.valueInternal = 0;
}
AttributeInt.prototype = new Attribute(Tundra.cAttributeInt);

AttributeInt.prototype.fromBinary = function(dd, changeType){
    this.set(dd.readS32(), changeType);
};

AttributeInt.prototype.toBinary = function(ds){
    ds.addS32(this.value);
}

// Real

function AttributeReal() {
    Attribute.call(this, Tundra.cAttributeReal);
    this.valueInternal = 0.0;
}

AttributeReal.prototype = new Attribute(Tundra.cAttributeReal);

AttributeReal.prototype.fromBinary = function(dd, changeType){
    this.set(dd.readFloat(), changeType);
};

AttributeReal.prototype.toBinary = function(ds){
    ds.addFloat(this.value);
};

// Color

function AttributeColor() {
    Attribute.call(this, Tundra.cAttributeColor);
    this.valueInternal = {};
    this.valueInternal.r = 0.0;
    this.valueInternal.g = 0.0;
    this.valueInternal.b = 0.0;
    this.valueInternal.a = 0.0;
}

AttributeColor.prototype = new Attribute(Tundra.cAttributeColor);

AttributeColor.prototype.fromBinary = function(dd, changeType){
    var newValue = {};
    newValue.r = dd.readFloat();
    newValue.g = dd.readFloat();
    newValue.b = dd.readFloat();
    newValue.a = dd.readFloat();
    this.set(newValue, changeType);
};

AttributeColor.prototype.toBinary = function(ds){
    ds.addFloat(this.value.r);
    ds.addFloat(this.value.g);
    ds.addFloat(this.value.b);
    ds.addFloat(this.value.a);
};

// Float2

function AttributeFloat2() {
    Attribute.call(this, Tundra.cAttributeFloat2);
    this.valueInternal = {};
    this.valueInternal.x = 0.0;
    this.valueInternal.y = 0.0;
}

AttributeFloat2.prototype = new Attribute(Tundra.cAttributeFloat2);

AttributeFloat2.prototype.fromBinary = function(dd, changeType){
    var newValue = {};
    newValue.x = dd.readFloat();
    newValue.y = dd.readFloat();
    this.set(newValue, changeType);
};

AttributeFloat2.prototype.toBinary = function(ds){
    ds.addFloat(this.value.x);
    ds.addFloat(this.value.y);
};

// Float3

function AttributeFloat3() {
    Attribute.call(this, Tundra.cAttributeFloat3);
    this.valueInternal = {};
    this.valueInternal.x = 0.0;
    this.valueInternal.y = 0.0;
    this.valueInternal.z = 0.0;
}

AttributeFloat3.prototype = new Attribute(Tundra.cAttributeFloat3);

AttributeFloat3.prototype.fromBinary = function(dd, changeType){
    var newValue = {};
    newValue.x = dd.readFloat();
    newValue.y = dd.readFloat();
    newValue.z = dd.readFloat();
    this.set(newValue, changeType);
};

AttributeFloat3.prototype.toBinary = function(ds){
    ds.addFloat(this.value.x);
    ds.addFloat(this.value.y);
    ds.addFloat(this.value.z);
};

// Float4

function AttributeFloat4() {
    Attribute.call(this, Tundra.cAttributeFloat4);
    this.valueInternal = {};
    this.valueInternal.x = 0.0;
    this.valueInternal.y = 0.0;
    this.valueInternal.z = 0.0;
    this.valueInternal.w = 0.0;
}

AttributeFloat4.prototype = new Attribute(Tundra.cAttributeFloat4);

AttributeFloat4.prototype.fromBinary = function(dd, changeType){
    var newValue = {};
    newValue.x = dd.readFloat();
    newValue.y = dd.readFloat();
    newValue.z = dd.readFloat();
    newValue.w = dd.readFloat();
    this.set(newValue, changeType);
};

AttributeFloat4.prototype.toBinary = function(ds){
    ds.addFloat(this.value.x);
    ds.addFloat(this.value.y);
    ds.addFloat(this.value.z);
    ds.addFloat(this.value.w);
};

// Bool

function AttributeBool() {
    Attribute.call(this, Tundra.cAttributeBool);
    this.valueInternal = false;
}

AttributeBool.prototype = new Attribute(Tundra.cAttributeBool);

AttributeBool.prototype.fromBinary = function(dd, changeType){
    this.set(dd.readU8() > 0 ? true : false, changeType);
};

AttributeBool.prototype.toBinary = function(ds){
    ds.addU8(this.value == true ? 1 : 0);
}

// UInt

function AttributeUInt() {
    Attribute.call(this, Tundra.cAttributeUInt);
    this.valueInternal = 0;
}
AttributeUInt.prototype = new Attribute(Tundra.cAttributeUInt);

AttributeUInt.prototype.fromBinary = function(dd, changeType){
    this.set(dd.readU32(), changeType);
};

AttributeUInt.prototype.toBinary = function(ds){
    ds.addU32(this.value);
}

// Quat

function AttributeQuat() {
    Attribute.call(this, Tundra.cAttributeQuat);
    this.valueInternal = {};
    this.valueInternal.x = 0.0;
    this.valueInternal.y = 0.0;
    this.valueInternal.z = 0.0;
    this.valueInternal.w = 0.0;
}

AttributeQuat.prototype = new Attribute(Tundra.cAttributeQuat);

AttributeQuat.prototype.fromBinary = function(dd, changeType){
    var newValue = {};
    newValue.x = dd.readFloat();
    newValue.y = dd.readFloat();
    newValue.z = dd.readFloat();
    newValue.w = dd.readFloat();
    this.set(newValue, changeType);
};

AttributeQuat.prototype.toBinary = function(ds){
    ds.addFloat(this.value.x);
    ds.addFloat(this.value.y);
    ds.addFloat(this.value.z);
    ds.addFloat(this.value.w);
};

// AssetReference

function AttributeAssetReference() {
    Attribute.call(this, Tundra.cAttributeAssetReference);
    this.valueInternal = {}
    this.valueInternal.ref = "";
    this.valueInternal.type = "";
}
AttributeAssetReference.prototype = new Attribute(Tundra.cAttributeAssetReference);

AttributeAssetReference.prototype.fromBinary = function(dd, changeType){
    var oldValue = this.value;
    oldValue.ref = dd.readString(); // Todo: migrate to Utf8String in the protocol
    this.set(oldValue, changeType);
};

AttributeAssetReference.prototype.toBinary = function(ds){
    ds.addString(this.value.ref);
};

// AssetReferenceList

function AttributeAssetReferenceList() {
    Attribute.call(this, Tundra.cAttributeAssetReferenceList);
    this.valueInternal = []
}

AttributeAssetReferenceList.prototype = new Attribute(Tundra.cAttributeAssetReference);

AttributeAssetReferenceList.prototype.fromBinary = function(dd, changeType){
    var newValue = [];
    var numRefs = dd.readU8();
    for (var i = 0; i < numRefs; i++)
    {
        var newRef = {};
        newRef.ref = dd.readString(); // Todo: migrate to Utf8String in the protocol
        newRef.type = "";
        newValue.push(newRef);
    }
    this.set(newValue, changeType);
};

AttributeAssetReferenceList.prototype.toBinary = function(ds){
    ds.addU8(this.value.length);
    for (var i = 0; i < this.value.length; i++)
    {
        ds.addString(this.value[i].ref);
    }
};

// EntityReference

function AttributeEntityReference() {
    Attribute.call(this, Tundra.cAttributeEntityReference);
    this.valueInternal = "";
}
AttributeEntityReference.prototype = new Attribute(Tundra.cAttributeEntityReference);

AttributeEntityReference.prototype.fromBinary = function(dd, changeType){
    this.set(dd.readString(), changeType); // Todo: migrate to Utf8String in the protocol
};

AttributeEntityReference.prototype.toBinary = function(ds){
    ds.addString(this.value);
};

// QVariant

function AttributeQVariant() {
    Attribute.call(this, Tundra.cAttributeQVariant);
    this.valueInternal = "";
}
AttributeQVariant.prototype = new Attribute(Tundra.cAttributeQVariant);

AttributeQVariant.prototype.fromBinary = function(dd, changeType){
    this.set(dd.readString(), changeType); // Todo: migrate to Utf8String in the protocol
};

AttributeQVariant.prototype.toBinary = function(ds){
    ds.addString(this.value);
};

// QVariantList

function AttributeQVariantList() {
    Attribute.call(this, Tundra.cAttributeQVariantList);
    this.valueInternal = [];
}
AttributeQVariantList.prototype = new Attribute(Tundra.cAttributeQVariantList);

AttributeQVariantList.prototype.fromBinary = function(dd, changeType){
    var newValue = [];
    var numItems = dd.readU8();
    for (var i = 0; i < numItems; i++)
        newValue.push(dd.readString()); // Todo: migrate to Utf8String in the protocol
    this.set(newValue);
};

AttributeQVariantList.prototype.toBinary = function(ds){
    ds.addU8(this.value.length);
    for (var i = 0; i < this.value.length; ++i)
        ds.addString(this.value[i]);
};

// Transform

function AttributeTransform() {
    Attribute.call(this, Tundra.cAttributeTransform);
    this.valueInternal = {};
    this.valueInternal.pos = {};
    this.valueInternal.rot = {};
    this.valueInternal.scale = {};
    this.valueInternal.pos.x = 0.0;
    this.valueInternal.pos.y = 0.0;
    this.valueInternal.pos.z = 0.0;
    this.valueInternal.rot.x = 0.0;
    this.valueInternal.rot.y = 0.0;
    this.valueInternal.rot.z = 0.0;
    this.valueInternal.scale.x = 1.0;
    this.valueInternal.scale.y = 1.0;
    this.valueInternal.scale.z = 1.0;
}

AttributeTransform.prototype = new Attribute(Tundra.cAttributeTransform);

AttributeTransform.prototype.fromBinary = function(dd, changeType){
    var newValue = {};
    newValue.pos = {};
    newValue.rot = {};
    newValue.scale = {};
    newValue.pos.x = dd.readFloat();
    newValue.pos.y = dd.readFloat();
    newValue.pos.z = dd.readFloat();
    newValue.rot.x = dd.readFloat();
    newValue.rot.y = dd.readFloat();
    newValue.rot.z = dd.readFloat();
    newValue.scale.x = dd.readFloat();
    newValue.scale.y = dd.readFloat();
    newValue.scale.z = dd.readFloat();
    this.set(newValue, changeType);
};

AttributeTransform.prototype.toBinary = function(ds){
    ds.addFloat(this.value.pos.x);
    ds.addFloat(this.value.pos.y);
    ds.addFloat(this.value.pos.z);
    ds.addFloat(this.value.rot.x);
    ds.addFloat(this.value.rot.y);
    ds.addFloat(this.value.rot.z);
    ds.addFloat(this.value.scale.x);
    ds.addFloat(this.value.scale.y);
    ds.addFloat(this.value.scale.z);
};

// QPoint

function AttributeQPoint() {
    Attribute.call(this, Tundra.cAttributeQPoint);
    this.valueInternal = {};
    this.valueInternal.x = 0;
    this.valueInternal.y = 0;
}

AttributeQPoint.prototype = new Attribute(Tundra.cAttributeQPoint);

AttributeQPoint.prototype.fromBinary = function(dd, changeType){
    var newValue = {};
    newValue.x = dd.readS32();
    newValue.y = dd.readS32();
    this.set(newValue);
};

AttributeQPoint.prototype.toBinary = function(ds){
    ds.addS32(this.value.x);
    ds.addS32(this.value.y);
};

Tundra.createAttribute = function(typeId) {
    // Convert typename to numeric ID if necessary
    if (typeof typeId == 'string' || typeId instanceof String)
        typeId = Tundra.attributeTypeIds[typeId];

    switch (typeId)
    {
    case Tundra.cAttributeString:
        return new AttributeString();
    case Tundra.cAttributeInt:
        return new AttributeInt();
    case Tundra.cAttributeReal:
        return new AttributeReal();
    case Tundra.cAttributeColor:
        return new AttributeColor();
    case Tundra.cAttributeFloat2:
        return new AttributeFloat2();
    case Tundra.cAttributeFloat3:
        return new AttributeFloat3();
    case Tundra.cAttributeFloat4:
        return new AttributeFloat4();
    case Tundra.cAttributeBool:
        return new AttributeBool();
    case Tundra.cAttributeUInt:
        return new AttributeUInt();
    case Tundra.cAttributeQuat:
        return new AttributeQuat();
    case Tundra.cAttributeAssetReference:
        return new AttributeAssetReference();
    case Tundra.cAttributeAssetReferenceList:
        return new AttributeAssetReferenceList();
    case Tundra.cAttributeEntityReference:
        return new AttributeEntityReference();
    case Tundra.cAttributeQVariant:
        return new AttributeQVariant();
    case Tundra.cAttributeQVariantList:
        return new AttributeQVariantList();
    case Tundra.cAttributeTransform:
        return new AttributeTransform();
    case Tundra.cAttributeQPoint:
        return new AttributeQPoint();
    default:
        console.log("Can not create unknown attribute type " + typeId);
        return null;
    }
}

Tundra.sanitatePropertyName = function(name) {
    return (name.substring(0, 1).toLowerCase() + name.substring(1)).trim();
}
