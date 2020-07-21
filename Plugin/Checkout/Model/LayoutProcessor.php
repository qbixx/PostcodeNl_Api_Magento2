<?php
namespace Flekto\Postcode\Plugin\Checkout\Model;
use Magento\Checkout\Block\Checkout\LayoutProcessor as ChekcoutLayerprocessor;
class LayoutProcessor
{
	protected $dataHelper;
	

	public function afterProcess(
		ChekcoutLayerprocessor $subject,
		array $jsLayout
	) {
		
			$flag = true;




 		$jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                ['shippingAddress']['children']['shipping-address-fieldset']['children']['country_id']['sortOrder'] = 41;


 /* All for shipping step */
 		$jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                ['shippingAddress']['children']['shipping-address-fieldset']['children']['city']['sortOrder'] = 42;

          $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                ['shippingAddress']['children']['shipping-address-fieldset']['children']['street']['sortOrder'] = 43;

	
		 $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                ['shippingAddress']['children']['shipping-address-fieldset']['children']['buyer_building_no']['sortOrder'] = 44; 

         	$jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                ['shippingAddress']['children']['shipping-address-fieldset']['children']['buyer_flat_no']['sortOrder'] = 45;                



            $jsLayout['components']['checkout']['children']['steps']['children']
        ['billing-step']['children']['payment']['children']
        ['payments-list']['children']['checkmo-form']['children']
        ['form-fields']['children']['city']['sortOrder'] = 41;

            $jsLayout['components']['checkout']['children']['steps']['children']
        ['billing-step']['children']['payment']['children']
        ['payments-list']['children']['checkmo-form']['children']
        ['form-fields']['children']['buyer_block_no']['sortOrder'] = 42;

            $jsLayout['components']['checkout']['children']['steps']['children']
        ['billing-step']['children']['payment']['children']
        ['payments-list']['children']['checkmo-form']['children']
        ['form-fields']['children']['street']['sortOrder'] = 43;

            $jsLayout['components']['checkout']['children']['steps']['children']
        ['billing-step']['children']['payment']['children']
        ['payments-list']['children']['checkmo-form']['children']
        ['form-fields']['children']['buyer_building_no']['sortOrder'] = 44;


            $jsLayout['components']['checkout']['children']['steps']['children']
        ['billing-step']['children']['payment']['children']
        ['payments-list']['children']['checkmo-form']['children']
        ['form-fields']['children']['buyer_flat_no']['sortOrder'] = 45;


		



		
		return $jsLayout;
	}
}