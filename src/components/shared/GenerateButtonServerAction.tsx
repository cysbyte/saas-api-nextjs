import React from 'react'
import {  useFormStatus } from 'react-dom'
import PricingPlanButton from './PricingPlanButton'


const GenerateButton = () => {
    const { pending } = useFormStatus();
  return (
    <div className="w-full mt-4">
          <PricingPlanButton
              text={pending?"Generating Speech...":"Generate"}
              isScale={false} />
      </div>
  )
}

export default GenerateButton