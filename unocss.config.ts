// https://nuxt.com/docs/api/configuration/nuxt-config
import type { UnocssNuxtOptions } from '@unocss/nuxt';

const unocssConfig: UnocssNuxtOptions = {
  components: true,
  attributify: true,
  icons: true,
  webFonts: { provider: 'google', fonts: { sans: 'Ubuntu:400,500,600' } },
  shortcuts: {
    'bg-primary': 'bg-[#B42424]',
    'bg-stone': 'bg-[#555555]',
    'bg-white-smoke': 'bg-[#F5F5F5]',
    'bg-floral': 'bg-[#FFF6F3]',
    'text-primary': 'text-[#B42424]',
    'text-carbon': 'text-[#2D2D2E]',
    'text-stone': 'text-[#555555]',
    'text-silver': 'text-[#A3A3A3]',
    'small-shadow': 'shadow-[0_2px_30px_rgba(45,45,46,0.06)]',
    'form-check-input':
      'accent-[#B42424] hover:accent-[#d81717] w-[20px] h-[20px]',
    'sub-heading':
      'hover:text-primary hover:underline mr-1 transition duration-700 cursor-pointer',
    'border-primary': 'border-[#B42424]',
    'border-smoke': 'border-[#F5F5F5]',
  },
};

export default unocssConfig;
