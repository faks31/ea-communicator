<script lang="ts" setup>
const RecentEmailHeaders = ['Receiver', 'Email Subject', 'Email Messages'];
const RecentEmailRows = [
  {
    Recipients: { value: 'johndoe@example.com', image: '/Ellipse.png' },
    EmailSubject: 'John Doe',
    EmailMessages: 'johndoe@example.com',
  },
  {
    Recipients: { value: 'johndoe@example.com', image: '/Ellipse.png' },
    EmailSubject: 'John Doe',
    EmailMessages: 'johndoe@example.com',
  },
  {
    Recipients: { value: 'johndoe@example.com', image: '/Ellipse.png' },
    EmailSubject: 'John Doe',
    EmailMessages: 'johndoe@example.com',
  },
];
</script>

<template>
  <div>
    <div class="mb-12">
      <h4 class="mb-4 text-carbon">Dashboard</h4>
      <p class="text-silver">
        Communicator /
        <span class="text-primary">Dashboard</span>
      </p>
    </div>
    <div class="items-center grid md:grid-cols-5 gap-6 mb-8">
      <div class="update-card flex justify-between items-center gap-15">
        <div>
          <h1 class="text-primary mb-2">25</h1>
          <p class="font-medium text-carbon">Sent sms</p>
        </div>
        <img alt="messages" src="/messages.png" />
      </div>
      <div class="update-card flex justify-between items-center gap-15">
        <div>
          <h1 class="text-primary mb-2">150</h1>
          <p class="font-medium text-carbon">Sent Emails</p>
        </div>
        <img alt="recipient and groups" src="/SentEmails.png" />
      </div>
      <div class="update-card flex justify-between items-center gap-15">
        <div>
          <h1 class="text-primary mb-2">230</h1>
          <p class="font-medium text-carbon">Sent messages</p>
        </div>
        <img alt="alerts" src="/alerts.png" />
      </div>
      <div class="update-card flex justify-between items-center gap-15">
        <div>
          <h1 class="text-primary mb-2">2367</h1>
          <p class="font-medium text-carbon">Sent Voice</p>
        </div>
        <img alt="library" src="/SentVoice.png" />
      </div>
      <div class="update-card flex justify-between items-center gap-15">
        <div>
          <h1 class="text-primary mb-2">2367</h1>
          <p class="font-medium text-carbon">library</p>
        </div>
        <img alt="library" src="/library.png" />
      </div>
    </div>
    <div class="md:flex gap-6">
      <div class="md:w-[66%] w-full">
        <DashboardCard title="Messages">
          <div class="md:flex flex-col justify-between items-center gap-10">
            <img src="/pie-chart.png" alt="" class="h-90" />
          </div>
          <div
            class="grid md:grid-cols-4 grid-cols-2 content-around gap-10 md:mb-0 mb-10"
          >
            <div class="mb-8 flex flex-col items-center md:items-start">
              <div class="flex items-center gap-2 mb-2">
                <img src="/messages.png" alt="" class="h-8" />
              </div>
              <div class="flex items-center mb-2">
                <h4 class="text-carbon mr-2">25</h4>
                <span class="text-[20px] font-normal text-stone">(4.4%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-silver">Sms</span>
              </div>
            </div>
            <div class="mb-8 flex flex-col items-center md:items-start">
              <div class="flex items-center gap-2 mb-2">
                <img src="/messages.png" alt="" class="h-8" />
              </div>
              <div class="flex items-center mb-2">
                <h4 class="text-carbon mr-2">150</h4>
                <span class="text-[20px] font-normal text-stone">(2.5%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-silver">Emails</span>
              </div>
            </div>
            <div class="mb-8 flex flex-col items-center md:items-start">
              <div class="flex items-center gap-2 mb-2">
                <img src="/messages.png" alt="" class="h-8" />
              </div>
              <div class="flex items-center mb-2">
                <h4 class="text-carbon mr-2">230</h4>
                <span class="text-[20px] font-normal text-stone">(4.7%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-silver">Alerts</span>
              </div>
            </div>
            <div class="mb-8 flex flex-col items-center md:items-start">
              <div class="flex items-center gap-2 mb-2">
                <img src="/messages.png" alt="" class="h-8" />
              </div>
              <div class="flex items-center mb-2">
                <h4 class="text-carbon mr-2">160</h4>
                <span class="text-[20px] font-normal text-stone">(2.3%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-silver">Voice</span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
      <DashboardCard title="" class="w-full">
        <div class="md:flex justify-between px-6 pb-6">
          <h5 class="text-stone mb-4 md:mb-0">Recent sent Emails</h5>
          <div class="flex justify-start">
            <p
              class="bg-white-smoke hover:bg-primary hover:text-white text-silver p-2 px-4"
            >
              Alerts
            </p>
            <p
              class="bg-white-smoke text-silver p-2 px-4 hover:bg-primary hover:text-white"
            >
              Email
            </p>
            <p
              class="bg-white-smoke text-silver p-2 px-4 hover:bg-primary hover:text-white"
            >
              Sms
            </p>
            <p
              class="bg-white-smoke text-silver p-2 px-4 hover:bg-primary hover:text-white"
            >
              Voice
            </p>
          </div>
        </div>
        <DashboardTable
          :headers="RecentEmailHeaders"
          :rows="RecentEmailRows"
          class="w-full overflow-auto scroll"
        />
      </DashboardCard>
    </div>
  </div>
</template>

<style lang="scss"></style>
