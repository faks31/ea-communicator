<script lang="ts" setup>
import type { AuthUser } from '~~/composables/useCurrentUser';

const showDropdown = ref('');
const SidebarOpen = ref(true);
const isDesktop = ref(false);
const user = ref<AuthUser>();
const route = useRoute();

const { logout } = useLogout();
const userStore = useCurrentUser();
watchEffect(() => {
  user.value = userStore.user;
});

const MenuItems = [
  {
    text: 'Dashboard',
    link: '/',
    strict: true,
    icon: 'dashboard.png',
    activeIcon: 'dashboard-active.png',
  },
  {
    text: 'Communications',
    link: '/email-messages',
    icon: 'email.png',
    activeIcon: 'email-active.png',
    items: [
      {
        text: 'Predefined Templates',
        link: '/email-messages/predefined-templates',
      },
      // TODO: uncomment when needed
      // {
      //   text: 'Scheduled Messages',
      //   link: '/email-messages/scheduled-message',
      // },
      { text: 'Alerts', link: '/email-messages/alert' },
      { text: 'Email', link: '/email-messages/email' },
      { text: 'SMS', link: '/email-messages/sms' },
      { text: 'Library', link: '/email-messages/library' },
    ],
  },
  {
    text: 'Recipients and Groups',
    link: '/recipients-and-groups',
    icon: 'recipients-groups.png',
    activeIcon: 'recipients-groups-active.png',
    items: [
      {
        text: 'Groups',
        link: '/recipients-and-groups/groups',
      },
      { text: 'Recipients', link: '/recipients-and-groups/recipients' },
    ],
  },
  {
    text: 'History',
    link: '/history',
    icon: 'history.png',
    activeIcon: 'history-active.png',
  },
];

type MenuItem = (typeof MenuItems)[0];
function isActiveItem(item: MenuItem) {
  if (item.strict) {
    return route.path === item.link;
  }

  return route.path.startsWith(item.link);
}

onMounted(() => {
  if (process.client) {
    isDesktop.value = window.matchMedia('(min-width: 768px)').matches;
    toggleDesktopClass();
  }
});

const toggleDesktopClass = () => {
  if (process.client) {
    if (!isDesktop.value) {
      document.body.classList.remove('sidebar-open');
    } else {
      document.body.classList.add('sidebar-open');
    }
  }
};

const toggleSidebar = () => {
  const opened = SidebarOpen.value;

  if (!opened) {
    document.body.classList.add('sidebar-open');
  } else {
    document.body.classList.remove('sidebar-open');
  }

  SidebarOpen.value = !opened;
};

watchEffect(() => {
  if (isDesktop.value) {
    SidebarOpen.value = true;
  } else {
    SidebarOpen.value = false;
  }

  toggleDesktopClass();
});
</script>

<template>
  <div>
    <button
      class="absolute top-[2.5em] left-[2em] border-none bg-transparent outline-none cursor-pointer lg:hidden block z-1"
      @click="toggleSidebar"
    >
      <img alt="" class="w-[1.5rem]" src="/hamburger-icon.png" />
    </button>
    <div :class="`shadow-2xl relative sidebar ${SidebarOpen ? 'open' : ''}`">
      <div
        class="absolute -right-[15px] top-[33px] shadow-[0_3.20559px_32.0559px_rgba(0,0,0,0.08)] bg-white w-[28px] h-[28px] p-[10px] rounded-[50%] md:flex hidden items-center cursor-pointer"
        @click="toggleSidebar"
      >
        <img
          alt="logo"
          :src="`/${SidebarOpen ? 'back-icon.png' : 'icon-stroke.png'}`"
        />
      </div>
      <div
        flex
        :class="`${
          SidebarOpen ? 'justify-start' : 'justify-center'
        }  logo pb-5`"
      >
        <img
          alt="logo"
          :src="`/${
            SidebarOpen ? 'SmartSuitLogo.png' : 'CommunicatorLogo.png'
          }`"
        />
      </div>
      <div class="menu-items">
        <div class="mt-8">
          <nav>
            <ul>
              <li
                v-for="item in MenuItems"
                :key="item.link"
                class="py-5 px-0 text-silver cursor-pointer relative"
              >
                <NuxtLink
                  :class="`${
                    isActiveItem(item) ? 'text-primary' : 'text-silver'
                  } no-underline flex items-center gap-3`"
                  :to="item.link"
                  @click="
                    showDropdown === item.link
                      ? (showDropdown = '')
                      : (showDropdown = item.link);
                    isDesktop ? null : (SidebarOpen = false);
                  "
                  ><img
                    alt="item-icon"
                    :src="`/${
                      isActiveItem(item) ? item.activeIcon : item.icon
                    }`"
                  />
                  {{ SidebarOpen ? item.text : '' }}
                  <img
                    v-if="item.items && SidebarOpen"
                    alt="logo"
                    :src="`/${SidebarOpen ? 'arrow-down.png' : ''}`"
                  />
                </NuxtLink>
                <ul
                  v-if="item.items && showDropdown === item.link && SidebarOpen"
                  class="transition mt-6"
                >
                  <li v-for="subitem in item.items" :key="subitem.link">
                    <NuxtLink
                      :class="`${
                        subitem.link && $route.path.includes(subitem.link)
                          ? 'text-primary bg-floral'
                          : 'text-silver'
                      } mt-2 px-10 py-3 block rounded-[4px] w-full`"
                      :to="subitem.link"
                      @click="isDesktop ? null : (SidebarOpen = false)"
                      >{{ SidebarOpen ? subitem.text : '' }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <div class="mb-[5rem]">
          <div class="flex items-center gap-3 cursor-pointer" @click="logout">
            <img src="/logout.png" alt="logout" />
            <button
              :class="`${
                SidebarOpen
                  ? 'text-silver border-none bg-white text-[16px] cursor-pointer'
                  : 'hidden'
              }`"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sidebar {
  width: 5.625em;
  height: 100vh;
  background: #ffffff;
  z-index: 1;
  transition: 0.5s;
  padding: 30px;
  @media screen and (max-width: 768px) {
    display: none;
  }

  .logo {
    border-bottom: 1px solid #f5f5f5;
  }

  .menu-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    align-items: center;
    padding-left: 0;
    ul {
      list-style-type: none;
      a {
        justify-content: center;
      }
    }
  }

  &.open {
    width: 317px;
    @media screen and (max-width: 768px) {
      position: absolute;
      top: 5.5rem;
      left: 0;
      display: block;
      overflow: auto;
    }

    .menu-items {
      align-items: flex-start;
      padding-left: 10px;

      ul {
        li {
          a {
            justify-content: flex-start;
          }
        }
      }
    }
  }
}
</style>
