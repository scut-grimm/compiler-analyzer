<template>
  <div>
    <grammar-input
      v-if="curStep === 'GrammarInput'"
      ref="GrammarInput"
    ></grammar-input>
    <first-set
      v-if="curStep === 'FirstSet'"
      ref="FirstSet"
    ></first-set>
    <follow-set
      v-if="curStep === 'FollowSet'"
      ref="FollowSet"
    ></follow-set>
    <IsLL1
      v-if="curStep === 'IsLL1'"
      ref="IsLL1"
    ></IsLL1>
    <PredictiveParsingTable
      v-if="curStep === 'PredictiveParsingTable'"
      ref="PredictiveParsingTable"
    ></PredictiveParsingTable>
    <parsing-stack
      v-if="curStep === 'ParsingStack'"
      ref="ParsingStack"
    ></parsing-stack>
  </div>
</template>

<script>
import GrammarInput from "~/components/generate-grammar-from-user-input";
import FirstSet from "~/components/first-set";
import FollowSet from "~/components/follow-set";
import IsLL1 from '~/components/isll1';
import ParsingStack from '~/components/parsing-stack'
import PredictiveParsingTable from "~/components/predictive-parsing-table";
import Grammar from "~/classes/grammar";
import GenerateFirstSet from "~/classes/algorithms/generate-first-set";
import GenerateFollowSet from "~/classes/algorithms/generate-follow-set";
import GeneratePPT from "~/classes/algorithms/generate-predictive-parsing-table";

export default {
  layout: "grammar",
  data() {
    return {
      curStep: 'GrammarInput',
      grammar: new Grammar()
    }
  },
  components: {
    GrammarInput,
    FirstSet,
    FollowSet,
    IsLL1,
    ParsingStack,
    PredictiveParsingTable
  },
  mounted() {
    this.$eventbus.$on('FinishInputGrammar', (grammar) => {
      this.grammar = grammar
      this.jumptTo('FirstSet')
    })
    this.$eventbus.$on('FinishFirstSet', () => {
      this.jumptTo('FollowSet')
    })
    this.$eventbus.$on('FinishFollowSet', () => {
      this.jumptTo('IsLL1')
    })
    this.$eventbus.$on('FinishIsLL1', () => {
      this.jumptTo('PredictiveParsingTable')
    })
    this.$eventbus.$on('FinishPPT', () => {
      this.jumptTo('ParsingStack')
    })
  },
  methods: {
    jumptTo(step) {
      this.regenerate(step)
      this.$store.commit('global/setStep',step)
      if (step === 'GrammarInput') {
        this.grammar = new Grammar()
      }
      this.curStep = step
      this.$nextTick(() => {
        if (step === 'GrammarInput') {

        }
        if (step === 'FirstSet') {
          this.$refs[step].setGrammar(this.grammar)
        }
        if (step === 'FollowSet') {
          this.$refs[step].setGrammar(this.grammar)
        }
        if (step === 'IsLL1') {
          this.$refs[step].setGrammar(this.grammar)
        }
        if (step === 'PredictiveParsingTable') {
          this.$refs[step].setGrammar(this.grammar)
        }
        if (step === 'ParsingStack') {
          this.$refs[step].setGrammar(this.grammar)
        }
      })


    },
    regenerate(step) {
      if (step === 'GrammarInput') {
        return
      }
      if (step === 'FirstSet') {
        return
      }
      let firstSet = new GenerateFirstSet(this.grammar)
      let tmp = firstSet.run()
      this.grammar.setFirstSet(tmp)
      if (step === 'FollowSet') {
        return
      }
      let followSet = new GenerateFollowSet(this.grammar)
      this.grammar.setFollowSet(followSet.run())
      if (step === 'IsLL1') {
        return
      }
      if (step === 'PredictiveParsingTable') {
        return
      }
      let PPT = new GeneratePPT(this.grammar)
      this.grammar.setPPT(PPT.run())
      if (step === 'ParsingStack') {
        return
      }
    }
  }

};
</script>
<style lang="scss" scoped>
</style>
