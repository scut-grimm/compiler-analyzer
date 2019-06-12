<template>
  <div>
    <grammar-input
      v-if="curStep === 'GrammarInput'"
      ref="GrammarInput"
    ></grammar-input>
    <EliminateLeftRecursion
      v-if="curStep === 'EliminateLeftRecursion'"
      ref="EliminateLeftRecursion"
    ></EliminateLeftRecursion>
    <extract-left-factor
      v-if="curStep === 'ExtractLeftFactor'"
      ref="ExtractLeftFactor"
    ></extract-left-factor>
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
import ExtractLeftFactor from '~/components/extract-left-factor'
import ExtractLeftFactorAlgorithm from "~/classes/algorithms/extract-left-factor";
import FirstSet from "~/components/first-set";
import FollowSet from "~/components/follow-set";
import IsLL1 from '~/components/isll1';
import IsLL1Algorithm from "~/classes/algorithms/is-LL1";
import ParsingStack from '~/components/parsing-stack'
import PredictiveParsingTable from "~/components/predictive-parsing-table";
import Grammar from "~/classes/grammar";
import GenerateFirstSet from "~/classes/algorithms/generate-first-set";
import GenerateFollowSet from "~/classes/algorithms/generate-follow-set";
import GeneratePPT from "~/classes/algorithms/generate-predictive-parsing-table";
import EliminateLeftRecursion from "~/components/eliminate-left-recursion";
import EliminateLeftRecursionAlgorithm from "~/classes/algorithms/eliminate-left-recursion";

export default {
  layout: "grammar",
  data() {
    return {
      curStep: 'GrammarInput',
      grammar: new Grammar(),
      rawGrammar: new Grammar()
    }
  },
  components: {
    GrammarInput,
    FirstSet,
    FollowSet,
    IsLL1,
    ParsingStack,
    PredictiveParsingTable,
    ExtractLeftFactor,
    EliminateLeftRecursion
  },
  mounted() {
    this.$eventbus.$on('FinishInputGrammar', (grammar) => {
      this.rawGrammar = grammar
      this.jumptTo('EliminateLeftRecursion')
    })
    this.$eventbus.$on('FinishEliminateLeftRecursion', () => {
      this.jumptTo('ExtractLeftFactor')
    })
    this.$eventbus.$on('FinishExtractLeftFactor', () => {
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
    this.$eventbus.$on('goto', (step) => {
      this.jumptTo(step)
    })
  },
  methods: {
    jumptTo(step) {
      try {
        this.regenerate(step)
        this.$store.commit('global/setStep', step)
        if (step === 'GrammarInput') {
          this.grammar = new Grammar()
          this.rawGrammar = new Grammar()
        }
        this.curStep = step
        this.$nextTick(() => {
          if (step === 'GrammarInput') {

          }
          if (step === 'EliminateLeftRecursion') {
            this.$refs[step].setGrammar(this.rawGrammar)
          }
          if (step === 'ExtractLeftFactor') {
            this.$refs[step].setGrammar(this.grammar)
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
      } catch (e) {
        console.log(e)
        this.$alert(e.message, '错误', {
          confirmButtonText: '确定',
          type:'error'
        });
      }



    },
    regenerate(step) {
      if (step === 'GrammarInput') {
        return
      }
      if (this.rawGrammar.getProductions().length === 0) {
        this.jumptTo('GrammarInput')
        throw new Error('请先拟定文法')
      }
      if (step === 'EliminateLeftRecursion') {
        return
      }
      let { eliminateLeftRecursionGrammar } = EliminateLeftRecursionAlgorithm(this.rawGrammar)
      this.grammar = eliminateLeftRecursionGrammar
      if (step === 'ExtractLeftFactor') {
        return
      }
      let elf = new ExtractLeftFactorAlgorithm(this.grammar)
      let { newGrammar } = elf.run()
      this.grammar = newGrammar
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
      let isLL1 = IsLL1Algorithm(this.grammar)
      if (isLL1.isLL1 === false) {
        if (this.rawGrammar.getProductions().length === 0) {
          this.jumptTo('IsLL1')
          throw new Error('该文法不是LL1, 无法进入下一步骤')
        }
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
