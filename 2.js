
phoneBook = [
  {
      age: 33,
      gender: '�������',
      name: '���������',
      email: 'luisazamora@quilk.com',
      phone: '+7 (921) 505-3570',
      favoriteFruit: '���������'
  },
  {
      age: 35,
      gender: '�������',
      name: '����',
      email: 'roachpugh@mitroc.com',
      phone: '+7 (999) 539-2625',
      favoriteFruit: '������'
  },
  {
      age: 21,
      gender: '�������',
      name: '�����',
      email: 'danamcgee@permadyne.com',
      phone: '+7 (802) 526-2845',
      favoriteFruit: '���������'
  }]

  function select() 
{return function (collection){
    var args = [].slice.call(arguments);
    return collection.map( function (abonent){
        var newAbonet={};
        for(var i=0; i < args.length; i++)
            {newAbonet[args[i]]=abonent[args[i]];}
        return newAbonet;
        });
    };
};

function filterIn (field, validValues){
 return collection.filter( function ( abonent)
{ 
for (var i=0, k=true; i< validValues.length && k===true; i++)
{if (abonent[field].indexOf(validValues[i])===-1) 
{k=false;}
}
 return k;})};
 
 

 function show (d){
for (var i=0; i< d.length;i++){
console.log(d[i]);}} 



function sort (field,sortingOrder){return function (collection){
newcollection=collection.sort(
 function (a,b){
if (a[field]<b[field]){ return -1};
if (a[field]>b[field]){ return 1};
if (a[field]=b[field]){ return 0};});

if(sortingOrder === 'asc'){ return newcollection;}
else {return newcollection.reverse()};
};};

  function format(field, formatValues)
    { return function (collection)
    {collection.map(function(abonent){
    var newAbonet=abonent;
    newAbonet[field] = formatValues(abonent[field]);
    return newAbonet;
    });
return collection;};
    
};




function add (collection /* ��������� ����� ������� */) {
var ncollection = collection;
var args = [].slice.call(arguments);
for (var i=1; i < args.length; i++){
ncollection=args[i](ncollection);}
return ncollection;};

show( add (phoneBook,sort('age', 'asc'),format('gender', function (value) {
        return value[0];
    }) ));



