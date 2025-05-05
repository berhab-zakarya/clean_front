'use client'
import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export default function StoreSetupGuidePage() {


  return (
    <div className="font-sans max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <p className="text-lg">Sélectionnez un forfait pour bénéficier de 3 mois à 1 $/mois</p>
        <div className="flex gap-4 items-center">
          <button className="bg-white text-blue-800 px-4 py-2 rounded-full font-medium">Select a plan</button>
          <X className="cursor-pointer" size={24} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Préparez-vous à vendre</h1>
        <p className="text-gray-600 mb-6">Voici un guide pour démarrer. Vous recevrez ici de nouveaux conseils et informations au fur et à mesure que votre entreprise se développera.</p>

        {/* Setup Guide */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('setup')}
          >
            <h2 className="text-xl font-semibold">Setup guide</h2>
            {expandedSections.setup ? <ChevronUp /> : <ChevronDown />}
          </div>
          
          {expandedSections.setup && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-4">Use this personalized guide to get your store up and running</p>
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-2">
                  <span className="text-sm">0</span>
                </div>
                <span className="text-gray-700">sur 7 tâches effectuées</span>
              </div>
            </div>
          )}
        </div>

        {/* Choose Store Name */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('name')}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-xl font-semibold">Choisir le nom de votre boutique</h2>
            </div>
            {expandedSections.name ? <ChevronUp /> : <ChevronDown />}
          </div>
          
          {expandedSections.name && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-6">Le nom temporaire de votre boutique est actuellement Ma boutique. Le nom de la boutique apparaît dans votre interface administrateur et sur votre boutique en ligne.</p>
              <button className="bg-blue-800 text-white px-6 py-3 rounded-md">Choisir le nom de la boutique</button>
            </div>
          )}
        </div>

        {/* Add Custom Domain */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('domain')}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-xl font-semibold">Ajouter un domaine Personnalisé</h2>
            </div>
            {expandedSections.domain ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>

        {/* Add First Product */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('product')}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-xl font-semibold">Ajouter votre premier produit</h2>
            </div>
            {expandedSections.product ? <ChevronUp /> : <ChevronDown />}
          </div>
          
          {expandedSections.product && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-6">Rédigez une description, ajoutez des photos et fixez la tarification des produits que vous prévoyez de vendre.</p>
              
              <div className="flex items-center">
                <button className="bg-blue-800 text-white px-6 py-3 rounded-md mr-4">Ajouter un produit</button>
                <button className="text-gray-700 px-2 py-3">Importer un produit</button>
              </div>
              
              <div className="flex justify-end mt-4">
                <div className="grid grid-cols-2 gap-2 w-48">
                  <div className="bg-blue-400 h-24 rounded"></div>
                  <div className="bg-purple-200 h-12 rounded"></div>
                  <div className="col-span-1 bg-red-200 h-12 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optimize Shipping */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('shipping')}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-xl font-semibold">Optimisez vos tarifs d'exepédition</h2>
            </div>
            {expandedSections.shipping ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>

        {/* Configure Payment Provider */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('payment')}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-xl font-semibold">Configurer un fournisseur de services de paiement</h2>
            </div>
            {expandedSections.payment ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>

        {/* Place Test Order */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('testOrder')}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-xl font-semibold">Passez une commande de test</h2>
            </div>
            {expandedSections.testOrder ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
      </div>
    </div>
  );
}